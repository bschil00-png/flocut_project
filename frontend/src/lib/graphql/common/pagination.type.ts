// lib/types/page.ts

export interface PageRequestInput {
    page: number; // 0-based
    size: number;
}

export interface PageResponse<T> {
    content: T[];

    totalElements: number;
    totalPages: number;

    pageNumber: number;
    pageSize: number;

    hasNext: boolean;
    hasPrevious: boolean;

    isFirst: boolean;
    isLast: boolean;
}
