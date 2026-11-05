import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerPwaServiceWorker } from './registerServiceWorker';
import { AUTH_MODE } from './lib/auth/supabaseClient';
import { StaffLoginGate } from './components/auth/StaffLoginGate';
import { FamilyUploadPage } from './components/family/FamilyUploadPage';
import { tokenFromPath } from './lib/services/tributeApi';

registerPwaServiceWorker();

// Global print handler: Ensures browser print headers (URL/domain or page title) are never printed
if (typeof window !== 'undefined') {
  let savedTitle = document.title;
  window.addEventListener('beforeprint', () => {
    savedTitle = document.title;
    document.title = '\u00A0'; // Non-breaking space prevents Chromium from falling back to domain/URL
  });
  window.addEventListener('afterprint', () => {
    document.title = savedTitle;
  });
}

// Public family upload page (/u/<private token>): never behind staff sign-in.
const familyToken = typeof window !== 'undefined' ? tokenFromPath(window.location.pathname) : null;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {familyToken ? (
      <FamilyUploadPage token={familyToken} />
    ) : AUTH_MODE === 'supabase' ? (
      <StaffLoginGate>
        <App />
      </StaffLoginGate>
    ) : (
      <App />
    )}
  </React.StrictMode>,
);

