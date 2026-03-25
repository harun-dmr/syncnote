"use client";

import { useEffect, useMemo, useState } from "react";

type ShareModalProps = {
  isOpen: boolean; noteTitle: string; noteContent: string;
  onShare: () => void; onClose: () => void;
};

export default function ShareModal({ isOpen, noteTitle, noteContent, onShare, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const token = useMemo(() => {
    try { return btoa(encodeURIComponent(JSON.stringify({ title: noteTitle, content: noteContent }))); }
    catch { return ""; }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && token) setShareUrl(`${window.location.origin}/shared/${token}`);
  }, [isOpen, token]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    onShare();
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      <div className="animate-scale-in glass relative z-10 w-full max-w-md overflow-hidden rounded-2xl shadow-2xl shadow-black/60">
        {/* Top accent line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />

        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/[0.06] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/30 to-indigo-600/20 ring-1 ring-violet-500/30">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgb(167,139,250)" strokeWidth="2">
                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Notiz teilen</h3>
              <p className="mt-0.5 truncate text-sm text-slate-500">&ldquo;{noteTitle}&rdquo;</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-600 transition hover:bg-white/[0.06] hover:text-slate-300">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="space-y-3 px-6 py-5">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">Freigabelink</p>
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] p-2 pl-3">
              <code className="flex-1 truncate text-sm text-slate-400">{shareUrl}</code>
              <button onClick={handleCopy}
                className={`shrink-0 rounded-lg px-3.5 py-2 text-sm font-semibold transition-all duration-200 ${
                  copied ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30" : "shadow-md hover:scale-[1.03] hover:opacity-90 active:scale-[0.97]"
                }`}
                style={copied ? {} : { background: "var(--btn-bg)", color: "var(--btn-fg)" }}>
                {copied ? "✓ Kopiert" : "Kopieren"}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-violet-500/20 bg-violet-500/[0.06] p-4">
            <svg className="mt-0.5 shrink-0 text-violet-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-sm leading-relaxed text-slate-400">
              Jeder mit diesem Link kann die Notiz lesen. Der Inhalt ist im Link eingebettet.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-white/[0.06] px-6 py-4">
          <button onClick={onClose} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-white/[0.05] hover:text-slate-300">
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
}
