"use client";

import { useEffect, useState } from "react";

type Props = {
  isOpen: boolean;
  name: string;
  email: string;
  onSave: (name: string) => void;
  onClose: () => void;
};

export default function ProfileModal({ isOpen, name, email, onSave, onClose }: Props) {
  const [localName, setLocalName] = useState(name);

  useEffect(() => { if (isOpen) setLocalName(name); }, [isOpen, name]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const handleSave = () => {
    const trimmed = localName.trim();
    if (trimmed) { onSave(trimmed); onClose(); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      <div className="animate-scale-in glass relative z-10 w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl shadow-black/60">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />

        <div className="flex items-center justify-between border-b px-6 py-5" style={{ borderColor: "var(--bd)" }}>
          <h3 className="text-base font-semibold" style={{ color: "var(--t1)" }}>Profil</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 transition hover:bg-[var(--s4)]" style={{ color: "var(--t3)" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold shadow-lg"
              style={{ background: "var(--btn-bg)", color: "var(--btn-fg)" }}>
              {initials}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--t3)" }}>Name</label>
            <input
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
              className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition"
              style={{ border: "1px solid var(--bd)", background: "var(--s4)", color: "var(--t1)" }}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--t3)" }}>E-Mail</label>
            <div className="w-full rounded-xl px-4 py-2.5 text-sm" style={{ border: "1px solid var(--bd)", background: "var(--s4)", color: "var(--t2)" }}>
              {email || "—"}
            </div>
          </div>
        </div>

        <div className="flex gap-2 border-t px-6 py-4" style={{ borderColor: "var(--bd)" }}>
          <button onClick={onClose}
            className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition hover:bg-[var(--s4)]"
            style={{ border: "1px solid var(--bd)", color: "var(--t2)" }}>
            Abbrechen
          </button>
          <button onClick={handleSave} disabled={!localName.trim()}
            className="flex-1 rounded-xl py-2.5 text-sm font-semibold shadow-md transition hover:scale-[1.02] hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30"
            style={{ background: "var(--btn-bg)", color: "var(--btn-fg)" }}>
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}
