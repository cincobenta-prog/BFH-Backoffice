/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TWILIO_ACCOUNT_SID?: string;
  readonly VITE_TWILIO_AUTH_TOKEN?: string;
  readonly VITE_TWILIO_FROM_NUMBER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
