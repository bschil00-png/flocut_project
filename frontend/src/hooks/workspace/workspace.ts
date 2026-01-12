export type WorkspaceItemType = "note" | "document" | "audio";

export interface WorkspaceItem {
  id: string;
  type: WorkspaceItemType;
  title: string;
  date: string;

  noteId?: number;
  fileId?: number;
  status?: string;
}

export type WorkspaceFilter = WorkspaceItemType | "all";
