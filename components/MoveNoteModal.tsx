"use client";

import { useEffect, useState } from "react";
import { Folder } from "@/lib/types";

type Props = {
  isOpen: boolean; noteTitle: string; folders: Folder[];
  currentFolderId: string | null; onMove: (folderId: string | null) => void; onClose: () => void;
};

export default function MoveNoteModal({ isOpen, noteTitle, folders, currentFolderId, onMove, onClose }: Props) {
  const [selected, setSelected] = useState<string | null>(currentFolderId);

  useEffect(() => { if (isOpen) setSelected(currentFolderId); }, [isOpen, currentFolderId]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getFolderDepth = (id: string): number => {
    const folder = folders.find((f) => f.id === id);
    if (!folder || folder.parentId === null) return 0;
    return 1 + getFolderDepth(folder.parentId);
  };

  const sortedFolders = [...folders].sort((a, b) => {
    const dA = getFolderDepth(a.id), dB = getFolderDepth(b.id);
    return dA !== dB ? dA - dB : a.name.localeCompare(b.name);
  });

  const options = [
    { id: null as string | null, name: "Kein Ordner (Root)", depth: 0 },
    ...sortedFolders.map((f) => ({ id: f.id, name: f.name, depth: getFolderDepth(f.id) })),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      <div className="animate-scale-in glass relative z-10 w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl shadow-black/60">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />

        <div className="flex items-start justify-between border-b border-white/[0.06] px-6 py-5">
          <div>
            <h3 className="text-base font-semibold text-white">Notiz verschieben</h3>
            <p className="mt-0.5 truncate text-sm text-slate-500">&ldquo;{noteTitle}&rdquo;</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-600 transition hover:bg-white/[0.06] hover:text-slate-300">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="max-h-60 overflow-y-auto px-3 py-3">
          {options.map((opt) => {
            const isSel = opt.id === selected;
            return (
              <button key={String(opt.id)} onClick={() => setSelected(opt.id)}
                style={{ paddingLeft: `${12 + opt.depth * 16}px` }}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-all ${
                  isSel
                    ? "bg-gradient-to-r from-violet-600/25 to-indigo-600/10 text-violet-300 ring-1 ring-violet-500/30"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                }`}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke={isSel ? "rgb(167,139,250)" : "currentColor"} strokeWidth="2" className="shrink-0">
                  {opt.id === null
                    ? <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    : <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  }
                </svg>
                <span className="flex-1 truncate font-medium">{opt.name}</span>
                {isSel && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0 text-violet-400">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex gap-2 border-t border-white/[0.06] px-6 py-4">
          <button onClick={onClose}
            className="flex-1 rounded-xl border border-white/[0.08] py-2.5 text-sm font-semibold text-slate-400 transition hover:bg-white/[0.05] hover:text-slate-200">
            Abbrechen
          </button>
          <button onClick={() => onMove(selected)} disabled={selected === currentFolderId}
            className="flex-1 rounded-xl py-2.5 text-sm font-semibold shadow-md transition hover:scale-[1.02] hover:opacity-90 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ background: "var(--btn-bg)", color: "var(--btn-fg)" }}>
            Verschieben
          </button>
        </div>
      </div>
    </div>
  );
}
