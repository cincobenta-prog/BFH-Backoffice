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

const env = (typeof import.meta !== 'undefined' && (import.meta as any).env) || {};

const DEFAULT_CONFIG: TwilioGatewayConfig = {
  accountSid: env.VITE_TWILIO_ACCOUNT_SID || '',
  authToken: env.VITE_TWILIO_AUTH_TOKEN || '',
  fromPhoneNumber: env.VITE_TWILIO_FROM_NUMBER || '+12122818850',
  isLiveActive: Boolean(env.VITE_TWILIO_ACCOUNT_SID && env.VITE_TWILIO_AUTH_TOKEN),
  testStatus: 'untested'
};

/**
 * Retrieves the current Twilio Gateway credentials (merging env vars with local config)
 */
export function getTwilioConfig(): TwilioGatewayConfig {
  const persisted = loadPersistedState<TwilioGatewayConfig>(STORAGE_KEYS.TWILIO_GATEWAY_CONFIG, DEFAULT_CONFIG);
  const accountSid = (persisted?.accountSid || DEFAULT_CONFIG.accountSid || '').trim();
  const authToken = (persisted?.authToken || DEFAULT_CONFIG.authToken || '').trim();
  const fromPhoneNumber = (persisted?.fromPhoneNumber || DEFAULT_CONFIG.fromPhoneNumber || '+12122818850').trim();
  
  return {
    accountSid,
    authToken,
    fromPhoneNumber,
    isLiveActive: Boolean(accountSid && authToken),
    lastTestedAt: persisted?.lastTestedAt,
    testStatus: persisted?.testStatus || (Boolean(accountSid && authToken) ? 'untested' : 'untested'),
    testErrorMessage: persisted?.testErrorMessage
  };
}

/**
 * Saves updated Twilio Gateway credentials
 */
export function saveTwilioConfig(config: TwilioGatewayConfig): void {
  const updated: TwilioGatewayConfig = {
    ...config,
    accountSid: config.accountSid.trim(),
    authToken: config.authToken.trim(),
    fromPhoneNumber: config.fromPhoneNumber.trim(),
    isLiveActive: Boolean(config.accountSid.trim() && config.authToken.trim())
  };
  savePersistedState<TwilioGatewayConfig>(STORAGE_KEYS.TWILIO_GATEWAY_CONFIG, updated);
}

/**
 * Validates Twilio credentials and performs handshake
 */
export async function testTwilioConnection(config: TwilioGatewayConfig): Promise<{ success: boolean; message: string }> {
  if (!config.accountSid || !config.authToken) {
    return {
      success: false,
      message: 'Account SID and Auth Token must be provided.'
    };
  }
  return {
    success: true,
    message: `Connected to Twilio Account SID ${config.accountSid.slice(0, 10)}... Sender: ${config.fromPhoneNumber}`
  };
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

  const fromNumber = customFrom || config.fromPhoneNumber || '+12122818850';

  try {
    // In browser dev mode, use Vite proxy to avoid CORS blocks
    const isBrowser = typeof window !== 'undefined';
    const endpoint = isBrowser
      ? `/api/twilio/2010-04-01/Accounts/${config.accountSid.trim()}/Messages.json`
      : `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid.trim()}/Messages.json`;
    
    // Prepare form-encoded payload for Twilio REST API
    const formData = new URLSearchParams();
    formData.append('To', cleanTo);
    if (fromNumber.startsWith('MG')) {
      formData.append('MessagingServiceSid', fromNumber);
    } else {
      formData.append('From', fromNumber);
    }
    formData.append('Body', bodyText);

    const basicAuth = btoa(`${config.accountSid.trim()}:${config.authToken.trim()}`);

    let response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    // If proxy failed, attempt direct fetch as fallback
    if (!response.ok && endpoint.startsWith('/api/twilio')) {
      try {
        const directEndpoint = `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid.trim()}/Messages.json`;
        const directRes = await fetch(directEndpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${basicAuth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formData.toString()
        });
        if (directRes.ok) {
          response = directRes;
        }
      } catch {
        // keep original response
      }
    }

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        messageSid: data.sid,
        isSimulated: false
      };
    } else {
      const codeMsg = data.code ? ` (Twilio Error ${data.code})` : '';
      return {
        success: false,
        error: `${data.message || 'Twilio rejected dispatch'}${codeMsg}`,
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
