export type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  isShared?: boolean;
  folderId: string | null;
};

export type Folder = {
  id: string;
  name: string;
  parentId: string | null;
};
