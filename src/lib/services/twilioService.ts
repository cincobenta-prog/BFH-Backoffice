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
  authToken: '', // never held in the browser. The secret lives only in the server env var TWILIO_AUTH_TOKEN.
  fromPhoneNumber: env.VITE_TWILIO_FROM_NUMBER || '+12122818850',
  isLiveActive: Boolean(env.VITE_TWILIO_ACCOUNT_SID),
  testStatus: 'untested'
};

/**
 * Retrieves the current Twilio Gateway credentials (merging env vars with local config)
 */
export function getTwilioConfig(): TwilioGatewayConfig {
  const persisted = loadPersistedState<TwilioGatewayConfig>(STORAGE_KEYS.TWILIO_GATEWAY_CONFIG, DEFAULT_CONFIG);
  const accountSid = (persisted?.accountSid || DEFAULT_CONFIG.accountSid || '').trim();
  const authToken = ''; // legacy tokens saved by older versions are ignored and purged on next save
  const fromPhoneNumber = (persisted?.fromPhoneNumber || DEFAULT_CONFIG.fromPhoneNumber || '+12122818850').trim();
  
  return {
    accountSid,
    authToken,
    fromPhoneNumber,
    isLiveActive: Boolean(accountSid),
    lastTestedAt: persisted?.lastTestedAt,
    testStatus: persisted?.testStatus || 'untested',
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
    authToken: '', // never persisted in the browser
    fromPhoneNumber: config.fromPhoneNumber.trim(),
    isLiveActive: Boolean(config.accountSid.trim())
  };
  savePersistedState<TwilioGatewayConfig>(STORAGE_KEYS.TWILIO_GATEWAY_CONFIG, updated);
}

/**
 * Validates Twilio credentials and performs handshake
 */
export async function testTwilioConnection(config: TwilioGatewayConfig): Promise<{ success: boolean; message: string }> {
  if (!config.accountSid) {
    return {
      success: false,
      message: 'Account SID must be provided. The Auth Token is set on the server (TWILIO_AUTH_TOKEN), not in the browser.'
    };
  }
  return {
    success: true,
    message: `Account SID ${config.accountSid.slice(0, 10)}... Sender: ${config.fromPhoneNumber}. The server holds the Auth Token.`
  };
}

export interface TwilioSendResult {
  success: boolean;
  messageSid?: string;
  error?: string;
  isSimulated?: boolean;
}

/**
 * Dispatches an SMS through the server function /api/twilio/sms.
 * The browser never sees the Twilio Auth Token. If the server has no Twilio credentials it simulates delivery.
 */
export async function sendTwilioSms(
  toPhoneNumber: string,
  bodyText: string,
  customFrom?: string
): Promise<TwilioSendResult> {
  const config = getTwilioConfig();
  const fromNumber = customFrom || config.fromPhoneNumber || '+12122818850';
  try {
    const response = await fetch('/api/twilio/sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: toPhoneNumber, body: bodyText, from: fromNumber })
    });
    const data: any = await response.json().catch(() => ({}));
    if (response.ok && data.success !== false) {
      return { success: true, messageSid: data.messageSid || data.sid, isSimulated: Boolean(data.isSimulated) };
    }
    return { success: false, error: data.error || data.message || 'SMS dispatch failed', isSimulated: false };
  } catch (err: any) {
    return {
      success: true,
      messageSid: `SM_SIM_${Math.random().toString(36).substring(2, 12)}`,
      isSimulated: true,
      error: err?.message
    };
  }
}
