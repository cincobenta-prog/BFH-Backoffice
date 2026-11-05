import React, { useCallback, useEffect, useState } from 'react';
import type { GoldenRecordCase } from '../../lib/types/funeral';
import { createInvite, listItems, moderateItem, setPublished, TributeItemRow } from '../../lib/services/tributeApi';
import { AUTH_MODE } from '../../lib/auth/supabaseClient';

/**
 * Staff panel for the live, server-backed tribute of one case: invite family, approve what they send, publish.
 * Needs staff sign-in (VITE_AUTH_MODE=supabase) and the server functions deployed (api/tribute/*).
 */
export const TributeLiveServerPanel: React.FC<{ activeCase: GoldenRecordCase }> = ({ activeCase }) => {
  const caseId = activeCase.id;
  const [items, setItems] = useState<TributeItemRow[]>([]);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [link, setLink] = useState<string | null>(null);
  const [rName, setRName] = useState('');
  const [rContact, setRContact] = useState('');
  const [channel, setChannel] = useState<'sms' | 'email' | 'whatsapp'>('email');
  const [slug, setSlug] = useState(activeCase.decedent.legalName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try { setItems(await listItems(caseId)); } catch (e: any) { setMsg({ ok: false, text: e.message }); }
  }, [caseId]);
  useEffect(() => { if (AUTH_MODE === 'supabase') refresh(); }, [refresh]);

  if (AUTH_MODE !== 'supabase') {
    return <div className="mx-auto max-w-3xl rounded-2xl border border-[#ece5d8] bg-white p-6 text-sm text-[#69635b]">
      The live tribute needs staff sign-in. Turn on <code>VITE_AUTH_MODE=supabase</code> and deploy the server functions to use it.
    </div>;
  }

  const run = async (fn: () => Promise<void>) => {
    setBusy(true); setMsg(null);
    try { await fn(); } catch (e: any) { setMsg({ ok: false, text: e.message }); } finally { setBusy(false); }
  };

  const invite = (e: React.FormEvent) => { e.preventDefault(); run(async () => {
    const r = await createInvite({
      caseId, displayName: activeCase.decedent.legalName, dateOfBirth: activeCase.decedent.dateOfBirth, dateOfDeath: activeCase.decedent.dateOfDeath,
      recipientName: rName, recipientContact: rContact, channel
    });
    setLink(r.link); setMsg({ ok: true, text: `Private link created. It expires ${new Date(r.expiresAt).toLocaleDateString()}. Send it to ${rName}.` });
  }); };

  const act = (id: string, status: TributeItemRow['status']) => run(async () => { await moderateItem(id, status); await refresh(); });
  const publish = (p: boolean) => run(async () => { await setPublished(caseId, p, slug); setMsg({ ok: true, text: p ? `Published at /t/${slug}` : 'Unpublished.' }); });
  const pending = items.filter((i) => i.status === 'pending');

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="rounded-2xl border border-[#ece5d8] bg-white p-5 shadow-sm">
        <h2 className="font-serif text-xl font-semibold">1. Invite a family member</h2>
        <form onSubmit={invite} className="mt-3 grid gap-3 sm:grid-cols-3">
          <input required aria-label="Recipient name" placeholder="Name" value={rName} onChange={(e) => setRName(e.target.value)} className="rounded-xl border border-[#d9d1c2] px-3 py-2 text-sm" />
          <input aria-label="Email or phone" placeholder="Email or phone" value={rContact} onChange={(e) => setRContact(e.target.value)} className="rounded-xl border border-[#d9d1c2] px-3 py-2 text-sm" />
          <select aria-label="Channel" value={channel} onChange={(e) => setChannel(e.target.value as any)} className="rounded-xl border border-[#d9d1c2] px-3 py-2 text-sm">
            <option value="email">Email</option><option value="sms">Text message</option><option value="whatsapp">WhatsApp</option>
          </select>
          <button disabled={busy} className="rounded-xl bg-[#af893e] px-4 py-2 text-sm font-bold text-white disabled:opacity-60 sm:col-span-3">Create private link</button>
        </form>
        {link && <p className="mt-3 break-all rounded-xl bg-[#f7f3ea] p-3 font-mono text-xs select-all">{link}</p>}
      </div>

      <div className="rounded-2xl border border-[#ece5d8] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold">2. Review what families sent ({pending.length} waiting)</h2>
          <button type="button" onClick={refresh} className="text-xs font-semibold text-[#af893e] underline">Refresh</button>
        </div>
        {items.length === 0 && <p className="mt-3 text-sm text-[#69635b]">Nothing yet. Contributions appear here as families send them.</p>}
        <ul className="mt-3 space-y-3">
          {items.map((it) => (
            <li key={it.id} className="rounded-xl border border-[#ece5d8] p-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span><b>{it.contributor_name}</b>{it.contributor_relation ? `, ${it.contributor_relation}` : ''} · {it.media_type}</span>
                <span className="rounded-full bg-[#f1ece0] px-2 py-0.5 font-semibold">{it.status}</span>
              </div>
              {it.raw_transcript && <p className="mt-2 text-sm">{it.raw_transcript}</p>}
              {it.mediaUrl && it.media_type === 'photo' && <img src={it.mediaUrl} alt={it.caption || 'Photo from family'} className="mt-2 max-h-48 rounded-lg" />}
              {it.mediaUrl && it.media_type === 'voice' && <audio controls src={it.mediaUrl} className="mt-2 w-full" />}
              {it.mediaUrl && it.media_type === 'video' && <video controls src={it.mediaUrl} className="mt-2 max-h-56 w-full rounded-lg" />}
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <button disabled={busy} onClick={() => act(it.id, 'approved')} className="rounded-lg bg-emerald-600 px-3 py-1 font-bold text-white">Approve</button>
                <button disabled={busy} onClick={() => act(it.id, 'featured')} className="rounded-lg bg-[#af893e] px-3 py-1 font-bold text-white">Feature</button>
                <button disabled={busy} onClick={() => act(it.id, 'archived')} className="rounded-lg border border-[#d9d1c2] px-3 py-1 font-bold">Hide</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-[#ece5d8] bg-white p-5 shadow-sm">
        <h2 className="font-serif text-xl font-semibold">3. Publish the tribute page</h2>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#69635b]">/t/</span>
          <input aria-label="Page address" value={slug} onChange={(e) => setSlug(e.target.value)} className="min-w-0 flex-1 rounded-xl border border-[#d9d1c2] px-3 py-2 text-sm" />
          <button disabled={busy || !slug} onClick={() => publish(true)} className="rounded-xl bg-[#af893e] px-4 py-2 text-sm font-bold text-white disabled:opacity-60">Publish</button>
          <button disabled={busy} onClick={() => publish(false)} className="rounded-xl border border-[#d9d1c2] px-4 py-2 text-sm font-bold">Unpublish</button>
        </div>
        <p className="mt-2 text-xs text-[#69635b]">Only approved items appear on the public page. The public page itself is the next piece to build.</p>
      </div>

      {msg && <p role="status" className={`text-sm ${msg.ok ? 'text-emerald-700' : 'text-red-700'}`}>{msg.text}</p>}
    </div>
  );
};
