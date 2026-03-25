"use client";

import { useEffect, useRef, useState } from "react";
import { Note, Folder } from "@/lib/types";

type SortOrder = "newest" | "oldest" | "az";

// ─── NoteItem ─────────────────────────────────────────────────────────────────

function NoteItem({
  note, depth, isSelected, onSelect, onDelete,
}: {
  note: Note; depth: number; isSelected: boolean;
  onSelect: () => void; onDelete: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ paddingLeft: `${12 + depth * 18}px` }}
      className={`group flex items-center rounded-xl pr-2 transition-all duration-150 ${
        isSelected
          ? "bg-[var(--s5)] ring-1 ring-[var(--bd)] shadow-sm"
          : "hover:bg-[var(--s4)]"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={onSelect}
        className="flex min-w-0 flex-1 items-center gap-2.5 py-2 text-left text-[13px] font-medium transition-colors"
        style={{ color: isSelected ? "var(--t1)" : "var(--t2)" }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke={isSelected ? "var(--t1)" : "currentColor"}
          strokeWidth="1.75" className="shrink-0">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <span className="truncate">{note.title}</span>
        {note.isShared && (
          <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]" />
        )}
      </button>
      {hovered && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="ml-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg transition hover:bg-red-500/15 hover:text-red-400"
          style={{ color: "var(--t3)" }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4h6v2" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ─── FolderItem ───────────────────────────────────────────────────────────────

type FolderItemProps = {
  folder: Folder; depth: number; allFolders: Folder[]; allNotes: Note[];
  selectedNoteId: string | null; openFolderIds: Set<string>;
  editingFolderId: string | null; sortOrder: SortOrder;
  onSelect: (id: string) => void; onToggle: (id: string) => void;
  onCreateNote: (folderId: string) => void; onCreateFolder: (parentId: string) => void;
  onRenameStart: (id: string) => void; onRenameEnd: (id: string, name: string) => void;
  onDeleteNote: (id: string) => void; onDeleteFolder: (id: string) => void;
};

function FolderItem({
  folder, depth, allFolders, allNotes, selectedNoteId,
  openFolderIds, editingFolderId, sortOrder,
  onSelect, onToggle, onCreateNote, onCreateFolder,
  onRenameStart, onRenameEnd, onDeleteNote, onDeleteFolder,
}: FolderItemProps) {
  const [hovered, setHovered] = useState(false);
  const [localName, setLocalName] = useState(folder.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const isOpen = openFolderIds.has(folder.id);
  const isEditing = editingFolderId === folder.id;
  const subFolders = allFolders.filter((f) => f.parentId === folder.id);
  const folderNotes = sortNotes(allNotes.filter((n) => n.folderId === folder.id), sortOrder);

  useEffect(() => { setLocalName(folder.name); }, [folder.name]);
  useEffect(() => { if (isEditing) { inputRef.current?.focus(); inputRef.current?.select(); } }, [isEditing]);

  return (
    <div>
      <div
        style={{ paddingLeft: `${8 + depth * 18}px` }}
        className="flex items-center gap-1 rounded-xl py-0.5 pr-1 transition-colors hover:bg-[var(--s4)]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <button onClick={() => onToggle(folder.id)}
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-[var(--s5)]"
          style={{ color: "var(--t3)" }}>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
            style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}>
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        <svg width="14" height="14" viewBox="0 0 24 24"
          fill={isOpen ? "var(--s5)" : "none"}
          stroke={isOpen ? "var(--t1)" : "currentColor"}
          strokeWidth="1.75" className="shrink-0 transition-all duration-200"
          style={{ color: "var(--t2)" }}>
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>

        {isEditing ? (
          <input ref={inputRef} value={localName} onChange={(e) => setLocalName(e.target.value)}
            onBlur={() => { onRenameEnd(folder.id, localName.trim() || folder.name); }}
            onKeyDown={(e) => {
              if (e.key === "Enter") inputRef.current?.blur();
              if (e.key === "Escape") { setLocalName(folder.name); onRenameEnd(folder.id, folder.name); }
            }}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 rounded-lg px-2 py-0.5 text-[13px] font-medium outline-none ring-1 ring-[var(--bd)]"
            style={{ border: "1px solid var(--bd)", background: "var(--s5)", color: "var(--t1)" }} />
        ) : (
          <button onClick={() => onToggle(folder.id)}
            className="flex-1 truncate py-1.5 text-left text-[13px] font-medium transition-colors hover:text-[var(--t1)]"
            style={{ color: "var(--t2)" }}>
            {folder.name}
          </button>
        )}

        {hovered && !isEditing && (
          <div className="flex shrink-0 items-center">
            {[
              { title: "Neue Notiz", onClick: () => onCreateNote(folder.id), icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" /></> },
              { title: "Unterordner", onClick: () => onCreateFolder(folder.id), icon: <><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /><line x1="12" y1="11" x2="12" y2="17" /><line x1="9" y1="14" x2="15" y2="14" /></> },
              { title: "Umbenennen", onClick: () => onRenameStart(folder.id), icon: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></> },
            ].map((action) => (
              <button key={action.title} onClick={(e) => { e.stopPropagation(); action.onClick(); }} title={action.title}
                className="flex h-6 w-6 items-center justify-center rounded-lg transition-colors hover:bg-[var(--s5)] hover:text-[var(--t1)]"
                style={{ color: "var(--t3)" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">{action.icon}</svg>
              </button>
            ))}
            <button onClick={(e) => { e.stopPropagation(); onDeleteFolder(folder.id); }} title="Löschen"
              className="flex h-6 w-6 items-center justify-center rounded-lg transition-colors hover:bg-red-500/15 hover:text-red-400"
              style={{ color: "var(--t3)" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M9 6V4h6v2" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {isOpen && (
        <div>
          {subFolders.map((sub) => (
            <FolderItem key={sub.id} folder={sub} depth={depth + 1}
              allFolders={allFolders} allNotes={allNotes}
              selectedNoteId={selectedNoteId} openFolderIds={openFolderIds}
              editingFolderId={editingFolderId} sortOrder={sortOrder}
              onSelect={onSelect} onToggle={onToggle}
              onCreateNote={onCreateNote} onCreateFolder={onCreateFolder}
              onRenameStart={onRenameStart} onRenameEnd={onRenameEnd}
              onDeleteNote={onDeleteNote} onDeleteFolder={onDeleteFolder} />
          ))}
          {folderNotes.map((note) => (
            <NoteItem key={note.id} note={note} depth={depth + 1}
              isSelected={note.id === selectedNoteId}
              onSelect={() => onSelect(note.id)} onDelete={() => onDeleteNote(note.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sortNotes(notes: Note[], order: SortOrder): Note[] {
  return [...notes].sort((a, b) => {
    if (order === "az") return a.title.localeCompare(b.title);
    if (order === "oldest") return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

// ─── Main Sidebar ─────────────────────────────────────────────────────────────

type NotesSidebarProps = {
  notes: Note[]; folders: Folder[]; selectedNoteId: string | null;
  isMobileOpen: boolean;
  onMobileClose: () => void;
  onSelect: (id: string) => void; onCreateNote: (folderId: string | null) => void;
  onCreateFolder: (parentId: string | null) => void; onRenameFolder: (id: string, name: string) => void;
  onDeleteNote: (id: string) => void; onDeleteFolder: (id: string) => void;
};

const SORT_LABELS: Record<SortOrder, string> = { newest: "Neueste", oldest: "Älteste", az: "A–Z" };

export default function NotesSidebar({
  notes, folders, selectedNoteId, isMobileOpen,
  onMobileClose, onSelect, onCreateNote, onCreateFolder,
  onRenameFolder, onDeleteNote, onDeleteFolder,
}: NotesSidebarProps) {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const [openFolderIds, setOpenFolderIds] = useState<Set<string>>(
    () => new Set(folders.map((f) => f.id))
  );
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const prevFolderIdsRef = useRef<Set<string>>(new Set(folders.map((f) => f.id)));

  useEffect(() => {
    const currentIds = new Set(folders.map((f) => f.id));
    const newIds = [...currentIds].filter((id) => !prevFolderIdsRef.current.has(id));
    if (newIds.length > 0) {
      setOpenFolderIds((prev) => new Set([...prev, ...newIds]));
      setEditingFolderId(newIds[0]);
    }
    prevFolderIdsRef.current = currentIds;
  }, [folders]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target as Node)) setSortMenuOpen(false);
    };
    if (sortMenuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [sortMenuOpen]);

  const handleToggle = (id: string) => {
    setOpenFolderIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const rootFolders = folders.filter((f) => f.parentId === null);
  const rootNotes = sortNotes(notes.filter((n) => n.folderId === null), sortOrder);
  const isSearching = search.trim().length > 0;
  const searchResults = isSearching
    ? sortNotes(notes.filter((n) =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.content.toLowerCase().includes(search.toLowerCase())), sortOrder)
    : [];
  const isEmpty = notes.length === 0 && folders.length === 0;

  const sidebarContent = (
    <aside
      className="relative flex h-full w-[260px] shrink-0 flex-col overflow-hidden transition-colors"
      style={{ background: "var(--s3)", borderRight: "1px solid var(--bd)" }}
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-48 -translate-x-1/2 rounded-full bg-violet-600/[0.07] blur-3xl" />

      {/* Header: action buttons */}
      <div className="relative px-4 pb-4 pt-4">
        <div className="flex gap-2">
          <button onClick={() => { onCreateNote(null); onMobileClose(); }}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-[13px] font-semibold transition-all hover:opacity-85 hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "var(--btn-bg)", color: "var(--btn-fg)" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Neue Notiz
          </button>
          <button onClick={() => onCreateFolder(null)} title="Neuer Ordner"
            className="flex items-center justify-center rounded-xl border p-2 transition-all hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-500 active:scale-95"
            style={{ borderColor: "var(--bd)", background: "var(--s4)", color: "var(--t2)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              <line x1="12" y1="11" x2="12" y2="17" /><line x1="9" y1="14" x2="15" y2="14" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--t3)" }}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Suchen…"
            className="w-full rounded-xl py-2 pl-8 pr-3 text-[13px] outline-none transition focus:ring-1 focus:ring-violet-500/20"
            style={{
              background: "var(--s4)",
              border: "1px solid var(--bd)",
              color: "var(--t1)",
            }}
          />
          <style>{`.sidebar-search::placeholder { color: var(--t4); }`}</style>
        </div>
      </div>

      <div className="mx-4 mb-3" style={{ borderTop: "1px solid var(--bd)" }} />

      {/* Label + Sort */}
      <div className="mb-1.5 flex items-center justify-between px-4">
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--t3)" }}>
          {isSearching ? "Ergebnisse" : "Notizen"}
        </span>
        <div className="relative" ref={sortMenuRef}>
          <button onClick={() => setSortMenuOpen((v) => !v)}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition hover:bg-[var(--s4)] hover:text-[var(--t2)]"
            style={{ color: "var(--t3)" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            {SORT_LABELS[sortOrder]}
          </button>
          {sortMenuOpen && (
            <div className="glass animate-scale-in absolute right-0 top-full z-20 mt-1.5 w-32 overflow-hidden rounded-xl shadow-xl">
              {(Object.keys(SORT_LABELS) as SortOrder[]).map((key) => (
                <button key={key} onClick={() => { setSortOrder(key); setSortMenuOpen(false); }}
                  className={`flex w-full items-center justify-between px-3 py-2 text-[13px] transition-colors hover:bg-[var(--s4)] ${
                    sortOrder === key ? "text-violet-500" : ""
                  }`}
                  style={sortOrder === key ? {} : { color: "var(--t2)" }}>
                  {SORT_LABELS[key]}
                  {sortOrder === key && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border" style={{ borderColor: "var(--bd)", background: "var(--s4)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--t3)" }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <p className="text-[13px] font-medium" style={{ color: "var(--t2)" }}>Noch keine Notizen</p>
            <p className="mt-1 text-[12px]" style={{ color: "var(--t3)" }}>Erstelle deine erste Notiz.</p>
          </div>
        ) : isSearching ? (
          searchResults.length === 0 ? (
            <p className="py-10 text-center text-[13px]" style={{ color: "var(--t3)" }}>Keine Treffer.</p>
          ) : (
            <div className="space-y-0.5">
              {searchResults.map((note) => (
                <NoteItem key={note.id} note={note} depth={0}
                  isSelected={note.id === selectedNoteId}
                  onSelect={() => { onSelect(note.id); onMobileClose(); }}
                  onDelete={() => onDeleteNote(note.id)} />
              ))}
            </div>
          )
        ) : (
          <div className="space-y-0.5">
            {rootFolders.map((folder) => (
              <FolderItem key={folder.id} folder={folder} depth={0}
                allFolders={folders} allNotes={notes}
                selectedNoteId={selectedNoteId} openFolderIds={openFolderIds}
                editingFolderId={editingFolderId} sortOrder={sortOrder}
                onSelect={(id) => { onSelect(id); onMobileClose(); }} onToggle={handleToggle}
                onCreateNote={(folderId) => onCreateNote(folderId)}
                onCreateFolder={(parentId) => onCreateFolder(parentId)}
                onRenameStart={(id) => setEditingFolderId(id)}
                onRenameEnd={(id, name) => { onRenameFolder(id, name); setEditingFolderId(null); }}
                onDeleteNote={onDeleteNote} onDeleteFolder={onDeleteFolder} />
            ))}
            {rootNotes.map((note) => (
              <NoteItem key={note.id} note={note} depth={0}
                isSelected={note.id === selectedNoteId}
                onSelect={() => { onSelect(note.id); onMobileClose(); }}
                onDelete={() => onDeleteNote(note.id)} />
            ))}
          </div>
        )}
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden md:flex">{sidebarContent}</div>
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onMobileClose} />
          <div className="relative z-10 flex">{sidebarContent}</div>
        </div>
      )}
    </>
  );
}
