"use client";

import { useEffect, useRef, useState } from "react";

type TopbarProps = {
  title: string; updatedAt: string; isShared: boolean;
  onShare: () => void; onTitleChange: (title: string) => void;
  onMove: () => void; onExport: () => void; onMobileMenuToggle: () => void;
};

export default function Topbar({
  title, updatedAt, isShared, onShare, onTitleChange, onMove, onExport, onMobileMenuToggle,
}: TopbarProps) {
  const [editing, setEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(title);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setLocalTitle(title); }, [title]);
  useEffect(() => { if (editing) { inputRef.current?.focus(); inputRef.current?.select(); } }, [editing]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const handleBlur = () => {
    setEditing(false);
    const trimmed = localTitle.trim();
    onTitleChange(trimmed || title);
    if (!trimmed) setLocalTitle(title);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") inputRef.current?.blur();
    if (e.key === "Escape") { setLocalTitle(title); setEditing(false); }
  };

  return (
    <header
      className="relative flex shrink-0 items-center justify-between px-5 py-3 transition-colors md:px-8 md:py-4"
      style={{ background: "var(--s2)", borderBottom: "1px solid var(--bd)" }}
    >
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-500/15 to-transparent" />

      {/* Left */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button onClick={onMobileMenuToggle}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition hover:bg-[var(--s4)] md:hidden"
          style={{ color: "var(--t2)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className="flex min-w-0 flex-col">
          {editing ? (
            <input ref={inputRef} value={localTitle} onChange={(e) => setLocalTitle(e.target.value)}
              onBlur={handleBlur} onKeyDown={handleKeyDown}
              className="-mx-2 rounded-xl bg-violet-500/10 px-2 py-1 text-xl font-bold outline-none ring-2 ring-violet-500/30 md:text-2xl"
              style={{ color: "var(--t1)" }} />
          ) : (
            <button onClick={() => setEditing(true)}
              className="group -mx-2 flex items-center gap-2 rounded-xl px-2 py-1 transition hover:bg-[var(--s4)]">
              <h2 className="truncate text-xl font-bold md:text-2xl" style={{ color: "var(--t1)" }}>{localTitle}</h2>
              <svg className="shrink-0 opacity-0 transition group-hover:opacity-100"
                width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                style={{ color: "var(--t3)" }}>
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          )}

          <div className="flex items-center gap-2 px-2 text-xs" style={{ color: "var(--t3)" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{updatedAt}</span>
            {isShared && (
              <>
                <span className="h-1 w-1 rounded-full bg-current opacity-30" />
                <span className="flex items-center gap-1.5 font-medium text-emerald-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                  Geteilt
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="ml-3 flex shrink-0 items-center gap-2">
        <div className="relative" ref={menuRef}>
          <button onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border transition-all"
            style={{
              borderColor: menuOpen ? "rgba(139,92,246,0.3)" : "var(--bd)",
              background: menuOpen ? "rgba(139,92,246,0.1)" : undefined,
              color: menuOpen ? "rgb(167,139,250)" : "var(--t2)",
            }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="5" r="1" fill="currentColor" />
              <circle cx="12" cy="12" r="1" fill="currentColor" />
              <circle cx="12" cy="19" r="1" fill="currentColor" />
            </svg>
          </button>

          {menuOpen && (
            <div className="glass animate-scale-in absolute right-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-xl shadow-2xl">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
              <div className="p-1.5">
                <button onClick={() => { setMenuOpen(false); onMove(); }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition hover:bg-[var(--s4)]"
                  style={{ color: "var(--t2)" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                  Verschieben
                </button>
                <button onClick={() => { setMenuOpen(false); onExport(); }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition hover:bg-[var(--s4)]"
                  style={{ color: "var(--t2)" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Exportieren
                </button>
              </div>
            </div>
          )}
        </div>

        <button onClick={onShare}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-md transition-all hover:scale-[1.03] hover:opacity-90 active:scale-[0.97]"
          style={{ background: "var(--btn-bg)", color: "var(--btn-fg)" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          <span className="hidden sm:inline">Teilen</span>
        </button>
      </div>
    </header>
  );
}
