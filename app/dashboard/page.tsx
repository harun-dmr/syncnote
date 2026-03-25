"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import AppHeader from "@/components/AppHeader";
import NotesSidebar from "@/components/notes/NotesSidebar";
import NoteEditor from "@/components/notes/NoteEditor";
import Topbar from "@/components/notes/Topbar";
import ShareModal from "@/components/notes/ShareModal";
import ConfirmModal from "@/components/ConfirmModal";
import MoveNoteModal from "@/components/MoveNoteModal";
import { Note, Folder } from "@/lib/types";
import { relativeTime } from "@/lib/utils";

type PendingDelete =
  | { type: "note"; id: string; name: string }
  | { type: "folder"; id: string; name: string };

export default function DashboardPage() {
  const { data: session, update: updateSession } = useSession();

  // ─── Data state ───────────────────────────────────────────────────────────────

  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [notesRes, foldersRes] = await Promise.all([
        fetch("/api/notes"),
        fetch("/api/folders"),
      ]);
      const [notesData, foldersData] = await Promise.all([
        notesRes.json(),
        foldersRes.json(),
      ]);
      setNotes(notesData);
      setFolders(foldersData);
      setSelectedNoteId(notesData[0]?.id ?? null);
      setIsLoading(false);
    }
    load();
  }, []);

  // ─── User ─────────────────────────────────────────────────────────────────────

  const userName = session?.user?.name ?? "Gast";
  const userEmail = session?.user?.email ?? "";

  const handleLogout = () => signOut({ callbackUrl: "/login" });

  const handleNameChange = async (name: string) => {
    await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    await updateSession({ name });
  };

  // ─── UI state ────────────────────────────────────────────────────────────────

  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);

  // Tick every 30s to re-render relative timestamps
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const selectedNote = useMemo(
    () => notes.find((note) => note.id === selectedNoteId) ?? null,
    [notes, selectedNoteId]
  );

  // ─── Note handlers ────────────────────────────────────────────────────────────

  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleContentChange = (value: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === selectedNoteId
          ? { ...note, content: value, updatedAt: new Date().toISOString() }
          : note
      )
    );
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      if (selectedNoteId) {
        fetch(`/api/notes/${selectedNoteId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: value }),
        });
      }
    }, 800);
  };

  const handleTitleChange = (title: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === selectedNoteId
          ? { ...note, title, updatedAt: new Date().toISOString() }
          : note
      )
    );
    if (selectedNoteId) {
      fetch(`/api/notes/${selectedNoteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
    }
  };

  const handleCreateNote = async (folderId: string | null) => {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Neue Notiz", content: "", folderId }),
    });
    const newNote: Note = await res.json();
    setNotes((prev) => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
  };

  const handleMoveNote = async (folderId: string | null) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedNoteId
          ? { ...n, folderId, updatedAt: new Date().toISOString() }
          : n
      )
    );
    if (selectedNoteId) {
      await fetch(`/api/notes/${selectedNoteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folderId }),
      });
    }
    setIsMoveModalOpen(false);
  };

  const handleExportNote = () => {
    if (!selectedNote) return;
    const blob = new Blob([selectedNote.content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedNote.title.replace(/[^\w\säöüÄÖÜß-]/g, "").trim() || "notiz"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleNoteShared = () => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedNoteId ? { ...n, isShared: true } : n
      )
    );
    if (selectedNoteId) {
      fetch(`/api/notes/${selectedNoteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isShared: true }),
      });
    }
  };

  const handleRequestDeleteNote = (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (note) setPendingDelete({ type: "note", id, name: note.title });
  };

  const handleRequestDeleteFolder = (id: string) => {
    const folder = folders.find((f) => f.id === id);
    if (folder) setPendingDelete({ type: "folder", id, name: folder.name });
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;

    if (pendingDelete.type === "note") {
      const remaining = notes.filter((n) => n.id !== pendingDelete.id);
      setNotes(remaining);
      if (selectedNoteId === pendingDelete.id) {
        setSelectedNoteId(remaining[0]?.id ?? null);
      }
      await fetch(`/api/notes/${pendingDelete.id}`, { method: "DELETE" });
    } else {
      const getFolderIds = (folderId: string): string[] => {
        const children = folders.filter((f) => f.parentId === folderId);
        return [folderId, ...children.flatMap((c) => getFolderIds(c.id))];
      };
      const folderIdsToDelete = new Set(getFolderIds(pendingDelete.id));
      const noteIdsToDelete = new Set(
        notes
          .filter((n) => n.folderId && folderIdsToDelete.has(n.folderId))
          .map((n) => n.id)
      );
      const remainingNotes = notes.filter((n) => !noteIdsToDelete.has(n.id));
      setFolders((prev) => prev.filter((f) => !folderIdsToDelete.has(f.id)));
      setNotes(remainingNotes);
      if (selectedNoteId && noteIdsToDelete.has(selectedNoteId)) {
        setSelectedNoteId(remainingNotes[0]?.id ?? null);
      }
      await Promise.all([
        ...[...folderIdsToDelete].map((id) =>
          fetch(`/api/folders/${id}`, { method: "DELETE" })
        ),
        ...[...noteIdsToDelete].map((id) =>
          fetch(`/api/notes/${id}`, { method: "DELETE" })
        ),
      ]);
    }

    setPendingDelete(null);
  };

  // ─── Folder handlers ──────────────────────────────────────────────────────────

  const handleCreateFolder = async (parentId: string | null) => {
    const res = await fetch("/api/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Neuer Ordner", parentId }),
    });
    const newFolder: Folder = await res.json();
    setFolders((prev) => [...prev, newFolder]);
  };

  const handleRenameFolder = async (id: string, name: string) => {
    setFolders((prev) =>
      prev.map((folder) => (folder.id === id ? { ...folder, name } : folder))
    );
    await fetch(`/api/folders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: "var(--s1)" }}>
        <svg className="animate-spin-slow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--t3)" }}>
          <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-screen flex-col overflow-hidden transition-colors" style={{ background: "var(--s1)" }}>
        <AppHeader
          userName={userName}
          userEmail={userEmail}
          onLogout={handleLogout}
          onMobileMenuToggle={() => setIsMobileSidebarOpen(true)}
          onNameChange={handleNameChange}
        />

        <div className="flex flex-1 overflow-hidden">
          <NotesSidebar
            notes={notes}
            folders={folders}
            selectedNoteId={selectedNoteId}
            isMobileOpen={isMobileSidebarOpen}
            onMobileClose={() => setIsMobileSidebarOpen(false)}
            onSelect={setSelectedNoteId}
            onCreateNote={handleCreateNote}
            onCreateFolder={handleCreateFolder}
            onRenameFolder={handleRenameFolder}
            onDeleteNote={handleRequestDeleteNote}
            onDeleteFolder={handleRequestDeleteFolder}
          />

          <main className="flex min-w-0 flex-1 flex-col">
            {selectedNote ? (
              <>
                <Topbar
                  title={selectedNote.title}
                  updatedAt={relativeTime(selectedNote.updatedAt)}
                  isShared={selectedNote.isShared ?? false}
                  onShare={() => setIsShareModalOpen(true)}
                  onTitleChange={handleTitleChange}
                  onMove={() => setIsMoveModalOpen(true)}
                  onExport={handleExportNote}
                  onMobileMenuToggle={() => setIsMobileSidebarOpen(true)}
                />
                <NoteEditor
                  content={selectedNote.content}
                  onChange={handleContentChange}
                />
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border" style={{ borderColor: "var(--bd)", background: "var(--s4)" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--t3)" }}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-[15px] font-medium" style={{ color: "var(--t2)" }}>Keine Notiz ausgewählt</p>
                  <p className="mt-1 text-sm" style={{ color: "var(--t3)" }}>Wähle eine Notiz aus oder erstelle eine neue.</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {selectedNote && (
        <ShareModal
          isOpen={isShareModalOpen}
          noteTitle={selectedNote.title}
          noteContent={selectedNote.content}
          onShare={handleNoteShared}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}

      {selectedNote && (
        <MoveNoteModal
          isOpen={isMoveModalOpen}
          noteTitle={selectedNote.title}
          folders={folders}
          currentFolderId={selectedNote.folderId}
          onMove={handleMoveNote}
          onClose={() => setIsMoveModalOpen(false)}
        />
      )}

      <ConfirmModal
        isOpen={pendingDelete !== null}
        title={
          pendingDelete?.type === "folder"
            ? `Ordner „${pendingDelete.name}" löschen?`
            : `Notiz „${pendingDelete?.name}" löschen?`
        }
        description={
          pendingDelete?.type === "folder"
            ? "Alle Notizen und Unterordner werden ebenfalls gelöscht. Diese Aktion kann nicht rückgängig gemacht werden."
            : "Diese Notiz wird dauerhaft gelöscht. Diese Aktion kann nicht rückgängig gemacht werden."
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
