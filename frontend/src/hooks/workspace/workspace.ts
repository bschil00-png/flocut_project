export type WorkspaceItemType = "note" | "document" | "audio";

export interface WorkspaceItem {
    id: string;
    type: WorkspaceItemType;
    title: string;
    date: string; // 표시용 (moddate ?? regdate)

    // 정렬용 필드 추가
    regdate: string; // 생성일
    moddate?: string; // 수정일 (optional)

    noteId?: number;
    fileId?: number;
    fileName?: string;
    status?: string;
}

export type WorkspaceFilter = WorkspaceItemType | "all";

export type SortBy = "recent" | "created" | "title";
export type ViewMode = "list" | "grid";