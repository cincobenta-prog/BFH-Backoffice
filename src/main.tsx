import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerPwaServiceWorker } from './registerServiceWorker';

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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

