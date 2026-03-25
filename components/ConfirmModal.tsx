"use client";

import { useEffect } from "react";

type Props = {
  isOpen: boolean; title: string; description: string;
  confirmLabel?: string; onConfirm: () => void; onCancel: () => void;
};

export default function ConfirmModal({ isOpen, title, description, confirmLabel = "Löschen", onConfirm, onCancel }: Props) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onCancel} />

      <div className="animate-scale-in glass relative z-10 w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl shadow-black/60">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

        <div className="px-6 pt-6 pb-2">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/15 ring-1 ring-red-500/25">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgb(248,113,113)" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4h6v2" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
        </div>

        <div className="flex gap-2 px-6 py-5">
          <button onClick={onCancel}
            className="flex-1 rounded-xl border border-white/[0.08] py-2.5 text-sm font-semibold text-slate-400 transition hover:bg-white/[0.05] hover:text-slate-200">
            Abbrechen
          </button>
          <button onClick={onConfirm}
            className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-500/20 transition hover:from-red-500 hover:to-rose-500 hover:scale-[1.02] active:scale-[0.98]">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
