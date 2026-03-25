import { Note, Folder } from "@/lib/types";

const now = Date.now();

export const mockFolders: Folder[] = [
  { id: "f1", name: "Projekte", parentId: null },
  { id: "f2", name: "Frontend", parentId: "f1" },
  { id: "f3", name: "Privat", parentId: null },
];

export const mockNotes: Note[] = [
  {
    id: "1",
    title: "Projektideen",
    content: "Kollaborative Notizen-App mit Token-Freigabe",
    updatedAt: new Date().toISOString(),
    isShared: true,
    folderId: null,
  },
  {
    id: "2",
    title: "Frontend Aufgaben",
    content: "Login, Dashboard, Editor und Share-Modal bauen",
    updatedAt: new Date(now - 12 * 60 * 1000).toISOString(),
    isShared: false,
    folderId: "f2",
  },
  {
    id: "3",
    title: "Mit Max geteilt",
    content: "Diese Notiz soll gemeinsam bearbeitet werden",
    updatedAt: new Date(now - 60 * 60 * 1000).toISOString(),
    isShared: true,
    folderId: "f1",
  },
];
