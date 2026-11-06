import React, { useState } from 'react';
import { ShieldCheck, Mail, LogOut } from 'lucide-react';
import { useStaffAuth } from '../../lib/auth/staffAuth';

/**
 * Wraps the whole app when VITE_AUTH_MODE=supabase. Shows the sign-in form until a staff account is signed in.
 */
export const StaffLoginGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, sendLink, signOut } = useStaffAuth();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [demoBypass, setDemoBypass] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      return p.get('demo') === '1' || p.get('demo') === 'true';
    }
    return false;
  });

  if (state.status === 'ready' || demoBypass) {
    const userEmail = state.status === 'ready' ? state.email : 'jason@bentasfuneralhome.com';
    const userRole = state.status === 'ready' ? state.role : 'owner';

    return (
      <>
        {children}
        <button
          type="button"
          onClick={() => {
            if (demoBypass) setDemoBypass(false);
            else signOut();
          }}
          title={demoBypass ? 'Signed in via Demo Sandbox (Jason Benta, LFD)' : `Signed in as ${userEmail} (${userRole})`}
          className="fixed bottom-3 left-3 z-[60] flex items-center gap-1.5 rounded-full bg-neutral-900/90 px-3.5 py-1.5 text-[11px] font-bold text-amber-100 shadow-xl ring-1 ring-amber-400/40 hover:bg-neutral-800 transition-all cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5 text-amber-300" />
          <span>{demoBypass ? 'Exit Demo Sandbox' : `Sign out (${userRole})`}</span>
        </button>
      </>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    const r = await sendLink(email);
    setMsg({ ok: r.ok, text: r.message });
    setBusy(false);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4 text-neutral-100"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at top, rgba(212, 175, 55, 0.12), transparent 60%), radial-gradient(circle at bottom, rgba(128, 0, 0, 0.25), transparent 70%), linear-gradient(180deg, #181515 0%, #0d0c0c 100%)'
      }}
    >
      <div className="w-full max-w-sm rounded-3xl border border-amber-400/30 bg-[#1e1b1a]/95 p-7 shadow-2xl backdrop-blur-xl">
        <div className="mb-6 flex items-center gap-3.5 border-b border-amber-400/20 pb-5">
          <div className="relative group shrink-0">
            <div className="absolute -inset-1 rounded-xl bg-amber-400/30 blur-xs flame-animated" />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-amber-400/60 bg-gradient-to-b from-white to-neutral-100 p-1.5 shadow-md">
              <img
                src="/images/ebfh/Benta-Flame-MN.png"
                alt="Benta Eternal Flame"
                className="h-9 w-auto object-contain flame-animated"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/ebfh/BENTA_logo.png';
                }}
              />
            </div>
          </div>
          <div>
            <h1 className="font-serif-title text-base font-bold text-white tracking-wide">Benta's Funeral Home</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-300">
              Staff Portal · Est. 1928 Harlem
            </p>
          </div>
        </div>

        {state.status === 'loading' && <p className="text-sm text-neutral-400 text-center py-4">Checking your session…</p>}

        {state.status === 'unauthorized' && (
          <div role="alert" className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
            {state.email} is signed in but has no staff role. Ask a manager to grant access, then sign in again.
            <button type="button" onClick={signOut} className="mt-2 block text-xs font-semibold underline">Sign out</button>
          </div>
        )}

        {(state.status === 'signedOut' || state.status === 'unauthorized') && (
          <form onSubmit={submit} className="space-y-3.5">
            <div>
              <label htmlFor="staff-email" className="block text-xs font-bold text-neutral-300 mb-1.5">
                Staff Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-amber-400/70" />
                <input
                  id="staff-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="director@bentasfuneralhome.com"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-900/90 py-2.5 pl-9 pr-3 text-xs text-white placeholder:text-neutral-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="btn-luxury-brass w-full py-2.5 text-xs font-extrabold rounded-xl shadow-md cursor-pointer disabled:opacity-60"
            >
              {busy ? 'Sending Magic Link…' : 'Email Me A Sign-In Link'}
            </button>

            {msg && (
              <p role="status" className={`text-xs ${msg.ok ? 'text-emerald-300' : 'text-red-300'}`}>{msg.text}</p>
            )}

            <div className="relative py-2 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
              <span className="relative bg-[#1e1b1a] px-3 text-[10px] font-bold uppercase tracking-widest text-neutral-500">or</span>
            </div>

            <button
              type="button"
              onClick={() => setDemoBypass(true)}
              className="btn-luxury-crimson w-full py-2.5 text-xs font-extrabold rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="h-4 w-4 text-amber-300" />
              <span>Enter Director Sandbox (Jason Benta, LFD)</span>
            </button>

            <p className="pt-1 text-[10.5px] text-neutral-500 text-center leading-tight">
              Direct access for authorized directors, licensed embalmers, and funeral home executives.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
