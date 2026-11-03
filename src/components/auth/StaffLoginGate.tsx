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

  if (state.status === 'ready') {
    return (
      <>
        {children}
        <button
          type="button"
          onClick={signOut}
          title={`Signed in as ${state.email} (${state.role})`}
          className="fixed bottom-3 left-3 z-[60] flex items-center gap-1.5 rounded-full bg-neutral-900/90 px-3 py-1.5 text-[11px] font-semibold text-amber-100 shadow-lg ring-1 ring-amber-400/40 hover:bg-neutral-800"
        >
          <LogOut className="h-3.5 w-3.5" /> Sign out ({state.role})
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
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
        <div className="mb-5 flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-amber-400" />
          <div>
            <h1 className="text-lg font-bold text-white">Benta's Funeral Home</h1>
            <p className="text-xs text-neutral-400">Staff sign-in</p>
          </div>
        </div>

        {state.status === 'loading' && <p className="text-sm text-neutral-400">Checking your session…</p>}

        {state.status === 'unauthorized' && (
          <div role="alert" className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
            {state.email} is signed in but has no staff role. Ask a manager to grant access, then sign in again.
            <button type="button" onClick={signOut} className="mt-2 block text-xs font-semibold underline">Sign out</button>
          </div>
        )}

        {(state.status === 'signedOut' || state.status === 'unauthorized') && (
          <form onSubmit={submit} className="space-y-3">
            <label htmlFor="staff-email" className="block text-xs font-bold text-neutral-300">Work email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
              <input
                id="staff-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@bentasfuneralhome.com"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 py-2 pl-9 pr-3 text-sm text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-amber-400 py-2 text-sm font-bold text-neutral-950 hover:bg-amber-300 disabled:opacity-60"
            >
              {busy ? 'Sending…' : 'Email me a sign-in link'}
            </button>
            {msg && (
              <p role="status" className={`text-xs ${msg.ok ? 'text-emerald-300' : 'text-red-300'}`}>{msg.text}</p>
            )}
            <p className="pt-1 text-[11px] text-neutral-500">The link signs you in on this device. You are signed out after 30 minutes without activity.</p>
          </form>
        )}
      </div>
    </div>
  );
};
