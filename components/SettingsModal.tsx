"use client";

import { useEffect } from "react";
import { useTheme } from "@/lib/theme-context";

type Props = { isOpen: boolean; onClose: () => void };

export default function SettingsModal({ isOpen, onClose }: Props) {
  const { isDark, toggle } = useTheme();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const themes = [
    {
      id: "dark",
      label: "Dark",
      isActive: isDark,
      preview: (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#050509]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgb(167,139,250)" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </div>
      ),
    },
    {
      id: "light",
      label: "Light",
      isActive: !isDark,
      preview: (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f0f2fb]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      <div className="animate-scale-in glass relative z-10 w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl shadow-black/60">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />

        <div className="flex items-center justify-between border-b px-6 py-5" style={{ borderColor: "var(--bd)" }}>
          <h3 className="text-base font-semibold" style={{ color: "var(--t1)" }}>Einstellungen</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 transition hover:bg-[var(--s4)]" style={{ color: "var(--t3)" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--t3)" }}>Erscheinungsbild</p>
          <div className="grid grid-cols-2 gap-2">
            {themes.map(({ id, label, isActive, preview }) => (
              <button
                key={id}
                onClick={() => { if (!isActive) toggle(); }}
                className="flex flex-col items-center gap-2.5 rounded-xl p-4 transition-all"
                style={{
                  border: `1px solid ${isActive ? "var(--btn-bg)" : "var(--bd)"}`,
                  background: isActive ? "var(--s5)" : "var(--s4)",
                }}
              >
                {preview}
                <span className="text-xs font-semibold" style={{ color: isActive ? "var(--t1)" : "var(--t2)" }}>{label}</span>
                {isActive && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "var(--t1)" }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end border-t px-6 py-4" style={{ borderColor: "var(--bd)" }}>
          <button onClick={onClose}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold transition hover:bg-[var(--s4)]"
            style={{ color: "var(--t2)" }}>
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
}
