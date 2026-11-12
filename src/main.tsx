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

// Error Boundary to prevent blank white screen on any unexpected runtime error
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Unhandled UI Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mb-4">
            <span className="text-3xl">🕊️</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-amber-200 mb-2">Benta&apos;s Funeral Home, Inc.</h1>
          <p className="text-sm text-neutral-400 max-w-md mb-6 leading-relaxed">
            The application encountered a display refresh requirement. Please click below to reload.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-[#800000] hover:bg-[#9a0000] text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Refresh Application
            </button>
            <button
              onClick={() => {
                try {
                  localStorage.clear();
                  sessionStorage.clear();
                } catch (e) {}
                window.location.href = '/';
              }}
              className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              Reset Session
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Public family upload page (/u/<private token>): never behind staff sign-in.
const familyToken = typeof window !== 'undefined' ? tokenFromPath(window.location.pathname) : null;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      {familyToken ? (
        <FamilyUploadPage token={familyToken} />
      ) : AUTH_MODE === 'supabase' ? (
        <StaffLoginGate>
          <App />
        </StaffLoginGate>
      ) : (
        <App />
      )}
    </ErrorBoundary>
  </React.StrictMode>,
);

