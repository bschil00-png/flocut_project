// src/components/notes/download/types.ts

export type DownloadFormat = "docx" | "pdf" | "md" | "txt";

export interface DownloadData {
    title: string;
    content: string;
    htmlContent?: string; //  HTML 추가 (이미지 포함)
}

export interface DownloadOption {
    format: DownloadFormat;
    label: string;
    description: string;
}

export const DOWNLOAD_OPTIONS: DownloadOption[] = [
    { format: "docx", label: "워드 (DOCX)", description: "Microsoft Word" },
    { format: "pdf", label: "PDF", description: "PDF 문서" },
    { format: "md", label: "마크다운 (MD)", description: "Markdown 파일" },
    { format: "txt", label: "텍스트 (TXT)", description: "일반 텍스트" },
];