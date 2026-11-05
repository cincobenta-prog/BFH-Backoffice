import React, { useEffect, useState } from 'react';
import { familyInfo, familySubmit, familyUpload } from '../../lib/services/tributeApi';

/**
 * Public page for families, opened from a private link: /u/<token>. No account, no staff sign-in.
 * Everything submitted waits for the funeral director's approval before it is shown.
 */
export const FamilyUploadPage: React.FC<{ token: string }> = ({ token }) => {
  const [info, setInfo] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [text, setText] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    familyInfo(token).then((i) => { setInfo(i); setName(i.recipientName || ''); }).catch((e) => setErr(e.message));
  }, [token]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!text.trim() && files.length === 0) { setErr('Please add a memory or at least one photo.'); return; }
    setBusy(true);
    try {
      if (text.trim()) await familySubmit({ token, contributorName: name, relation, mediaType: 'written', text, consent });
      for (const f of files) {
        const kind = f.type.startsWith('image/') ? 'photo' : f.type.startsWith('audio/') ? 'voice' : 'video';
        const path = await familyUpload(token, kind, f);
        await familySubmit({ token, contributorName: name, relation, mediaType: kind, storagePath: path, caption: f.name.replace(/\.[^.]+$/, ''), consent });
      }
      setDone('Thank you. The family will review what you shared before it is shown.');
      setText(''); setFiles([]);
    } catch (e: any) {
      setErr(e.message || 'Something went wrong. Please try again.');
    } finally { setBusy(false); }
  };

  const shell = (children: React.ReactNode) => (
    <div className="min-h-screen bg-[#f7f3ea] px-4 py-8 text-[#1a1815]">
      <div className="mx-auto w-full max-w-lg rounded-2xl border border-[#ece5d8] bg-white p-6 shadow-sm">{children}</div>
    </div>
  );

  if (err && !info) return shell(<p role="alert" className="text-sm text-red-700">{err}</p>);
  if (!info) return shell(<p className="text-sm text-[#69635b]">Opening your private link…</p>);

  return shell(
    <form onSubmit={send} className="space-y-4">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#af893e]">Benta's Funeral Home</p>
        <h1 className="font-serif text-2xl font-semibold">Share a memory of {info.case?.display_name}</h1>
        {info.personalNote && <p className="mt-1 text-sm italic text-[#69635b]">"{info.personalNote}"</p>}
      </div>
      <div>
        <label htmlFor="fu-name" className="mb-1 block text-xs font-bold">Your name</label>
        <input id="fu-name" required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-[#d9d1c2] px-3 py-2 text-sm" />
      </div>
      <div>
        <label htmlFor="fu-rel" className="mb-1 block text-xs font-bold">How you knew them (optional)</label>
        <input id="fu-rel" value={relation} onChange={(e) => setRelation(e.target.value)} placeholder="Granddaughter, neighbor, choir friend…" className="w-full rounded-xl border border-[#d9d1c2] px-3 py-2 text-sm" />
      </div>
      <div>
        <label htmlFor="fu-text" className="mb-1 block text-xs font-bold">Your memory</label>
        <textarea id="fu-text" rows={5} maxLength={5000} value={text} onChange={(e) => setText(e.target.value)} className="w-full rounded-xl border border-[#d9d1c2] px-3 py-2 text-sm" />
      </div>
      <div>
        <label htmlFor="fu-files" className="mb-1 block text-xs font-bold">Photos, audio or video (up to 15 MB each)</label>
        <input id="fu-files" type="file" multiple accept="image/jpeg,image/png,image/webp,audio/mpeg,audio/mp4,audio/webm,video/mp4,video/webm"
          onChange={(e) => setFiles(Array.from(e.target.files || []))} className="block w-full text-sm" />
        {files.length > 0 && <p className="mt-1 text-xs text-[#69635b]">{files.length} file{files.length === 1 ? '' : 's'} selected</p>}
      </div>
      <label className="flex items-start gap-2 text-xs text-[#4a453e]">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
        <span>I agree to share this with the family. The funeral director will review it before anything is shown.</span>
      </label>
      {err && <p role="alert" className="text-sm text-red-700">{err}</p>}
      {done && <p role="status" className="text-sm text-emerald-700">{done}</p>}
      <button type="submit" disabled={busy || !consent || !name.trim()} className="w-full rounded-xl bg-[#af893e] py-2.5 text-sm font-bold text-white disabled:opacity-50">
        {busy ? 'Sending…' : 'Send to the family'}
      </button>
    </form>
  );
};
