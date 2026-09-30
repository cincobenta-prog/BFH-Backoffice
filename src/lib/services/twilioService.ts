/**
 * Benta's Funeral Home - Twilio Cloud SMS Gateway Client
 * Handles real cellular SMS dispatching, credentials storage, and status verification.
 */

import { loadPersistedState, savePersistedState, STORAGE_KEYS } from '../storage/persistence';

export interface TwilioGatewayConfig {
  accountSid: string;
  authToken: string; // Auth Token or API Secret
  fromPhoneNumber: string; // E.164 formatted (+12122818850) or Messaging Service SID (MG...)
  isLiveActive: boolean;
  lastTestedAt?: string;
  testStatus?: 'success' | 'failed' | 'untested';
  testErrorMessage?: string;
}

const DEFAULT_CONFIG: TwilioGatewayConfig = {
  accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID || '',
  authToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN || '',
  fromPhoneNumber: import.meta.env.VITE_TWILIO_FROM_NUMBER || '+12122818850',
  isLiveActive: Boolean(import.meta.env.VITE_TWILIO_ACCOUNT_SID && import.meta.env.VITE_TWILIO_AUTH_TOKEN),
  testStatus: 'untested'
};

/**
 * Retrieves the current Twilio Gateway credentials (env vars or local config)
 */
export function getTwilioConfig(): TwilioGatewayConfig {
  return loadPersistedState<TwilioGatewayConfig>(STORAGE_KEYS.TWILIO_GATEWAY_CONFIG, DEFAULT_CONFIG);
}

/**
 * Saves updated Twilio Gateway credentials
 */
export function saveTwilioConfig(config: TwilioGatewayConfig): void {
  savePersistedState<TwilioGatewayConfig>(STORAGE_KEYS.TWILIO_GATEWAY_CONFIG, config);
}

export interface TwilioSendResult {
  success: boolean;
  messageSid?: string;
  error?: string;
  isSimulated?: boolean;
}

/**
 * Dispatches an SMS message using Twilio REST API
 */
export async function sendTwilioSms(
  toPhoneNumber: string,
  bodyText: string,
  customFrom?: string
): Promise<TwilioSendResult> {
  const config = getTwilioConfig();

  // If live credentials are not configured, simulate delivery
  if (!config.accountSid || !config.authToken) {
    return {
      success: true,
      messageSid: `SM_SIM_${Math.random().toString(36).substring(2, 12)}`,
      isSimulated: true
    };
  }

  // Format recipient number (E.164)
  let cleanTo = toPhoneNumber.replace(/[^\d+]/g, '');
  if (!cleanTo.startsWith('+')) {
    cleanTo = cleanTo.length === 10 ? `+1${cleanTo}` : `+${cleanTo}`;
  }

  const fromNumber = customFrom || config.fromPhoneNumber;

  try {
    const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/Messages.json`;
    
    // Prepare form-encoded payload for Twilio REST API
    const formData = new URLSearchParams();
    formData.append('To', cleanTo);
    if (fromNumber.startsWith('MG')) {
      formData.append('MessagingServiceSid', fromNumber);
    } else {
      formData.append('From', fromNumber);
    }
    formData.append('Body', bodyText);

    const basicAuth = btoa(`${config.accountSid}:${config.authToken}`);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        messageSid: data.sid,
        isSimulated: false
      };
    } else {
      return {
        success: false,
        error: data.message || `Twilio Error Code: ${data.code || response.status}`,
        isSimulated: false
      };
    }
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network error connecting to Twilio REST API',
      isSimulated: false
    };
  }
}
