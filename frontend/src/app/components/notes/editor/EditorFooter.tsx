// app/(workspace)/notes/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Plus,
    Filter,
    LayoutGrid,
    List,
    Calendar,
    Upload,
    Mic,
    FileText,
    Clock,
    Star,
    MoreHorizontal,
} from "lucide-react";

export default function NotesPage() {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [sortBy, setSortBy] = useState("recent");

    const notes = [
        {
            id: "1",
            title: "3월 마케팅 회의",
            preview: "Q1 성과 리뷰 및 2분기 전략 수립에 대한 논의...",
            date: "2시간 전",
            type: "note",
            starred: true,
            tags: ["회의", "마케팅"],
        },
        {
            id: "2",
            title: "FloCut 기획 정리",
            preview: "핵심 기능 명세 및 MVP 범위 정의...",
            date: "어제",
            type: "document",
            starred: false,
            tags: ["기획", "프로젝트"],
        },
        {
            id: "3",
            title: "개발 일정 정리",
            preview: "스프린트 계획 및 마일스톤 설정...",
            date: "3일 전",
            type: "note",
            starred: false,
            tags: ["개발", "일정"],
        },
        {
            id: "4",
            title: "음성 회의록 - 2024.12.15",
            preview: "음성 녹음을 기반으로 자동 생성된 회의록...",
            date: "5일 전",
            type: "audio",
            starred: true,
            tags: ["회의", "음성"],
        },
    ];

    const handleCreateNote = (type: "text" | "upload" | "audio") => {
        const newNoteId = Date.now().toString();
        router.push(`/notes/${newNoteId}?type=${type}`);
    };

    const handleSelectNote = (noteId: string) => {
        router.push(`/notes/${noteId}`);
    };

    return (
        <div className="h-full flex flex-col bg-background-light dark:bg-background-dark">
            {/* 페이지 헤더 */}
            <div className="border-b border-border-light dark:border-border-dark px-8 py-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-1">
                            모든 노트
                        </h1>
                        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                            24개의 노트
                        </p>
                    </div>

                    {/* 생성 액션 그룹 */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleCreateNote("text")}
                            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors font-medium"
                        >
                            <Plus size={18} />
                            새 노트
                        </button>
                        <button
                            onClick={() => handleCreateNote("upload")}
                            className="flex items-center gap-2 px-4 py-2 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark hover:bg-surface-hover dark:hover:bg-surface-input rounded-lg transition-colors"
                        >
                            <Upload size={18} />
                            문서 업로드
                        </button>
                        <button
                            onClick={() => handleCreateNote("audio")}
                            className="flex items-center gap-2 px-4 py-2 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark hover:bg-surface-hover dark:hover:bg-surface-input rounded-lg transition-colors"
                        >
                            <Mic size={18} />
                            음성 녹음
                        </button>
                    </div>
                </div>

                {/* 필터 & 뷰 전환 */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark hover:bg-surface-hover dark:hover:bg-surface-input text-sm text-text-primary-light dark:text-text-primary-dark transition-colors">
                            <Filter size={16} />
                            필터
                        </button>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-1.5 rounded-md border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-sm text-text-primary-light dark:text-text-primary-dark hover:bg-surface-hover dark:hover:bg-surface-input transition-colors cursor-pointer"
                        >
                            <option value="recent">최근 수정순</option>
                            <option value="created">생성일순</option>
                            <option value="title">제목순</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-1 p-1 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-1.5 rounded transition-colors ${
                                viewMode === "grid"
                                    ? "bg-accent text-white"
                                    : "text-text-muted-light dark:text-text-muted-dark hover:bg-surface-hover dark:hover:bg-surface-input"
                            }`}
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-1.5 rounded transition-colors ${
                                viewMode === "list"
                                    ? "bg-accent text-white"
                                    : "text-text-muted-light dark:text-text-muted-dark hover:bg-surface-hover dark:hover:bg-surface-input"
                            }`}
                        >
                            <List size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* 노트 그리드/리스트 */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
                {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {notes.map((note) => (
                            <div
                                key={note.id}
                                onClick={() => handleSelectNote(note.id)}
                                className="group p-5 rounded-lg border border-border-light dark:border-border-dark hover:border-accent dark:hover:border-accent bg-surface-light dark:bg-surface-dark hover:shadow-md transition-all cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        {note.type === "audio" ? (
                                            <Mic size={16} className="text-accent" />
                                        ) : note.type === "document" ? (
                                            <FileText size={16} className="text-text-muted-light dark:text-text-muted-dark" />
                                        ) : (
                                            <FileText size={16} className="text-text-muted-light dark:text-text-muted-dark" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {note.starred && <Star size={14} className="fill-accent text-accent" />}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // 더보기 메뉴 열기
                                            }}
                                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-surface-hover dark:hover:bg-surface-input rounded transition-opacity"
                                        >
                                            <MoreHorizontal size={14} />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-base font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 line-clamp-2">
                                    {note.title}
                                </h3>
                                <p className="text-sm text-text-muted-light dark:text-text-muted-dark line-clamp-2 mb-3">
                                    {note.preview}
                                </p>

                                <div className="flex items-center justify-between text-xs text-text-muted-light dark:text-text-muted-dark">
                                    <div className="flex items-center gap-1">
                                        <Clock size={12} />
                                        <span>{note.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {note.tags.slice(0, 2).map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-2 py-0.5 bg-surface-hover dark:bg-surface-input rounded"
                                            >
                        {tag}
                      </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {notes.map((note) => (
                            <div
                                key={note.id}
                                onClick={() => handleSelectNote(note.id)}
                                className="w-full group flex items-center gap-4 p-4 rounded-lg border border-border-light dark:border-border-dark hover:border-accent dark:hover:border-accent bg-surface-light dark:bg-surface-dark transition-all cursor-pointer"
                            >
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-surface-hover dark:bg-surface-input">
                                    {note.type === "audio" ? (
                                        <Mic size={18} className="text-accent" />
                                    ) : (
                                        <FileText size={18} className="text-text-muted-light dark:text-text-muted-dark" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark truncate">
                                            {note.title}
                                        </h3>
                                        {note.starred && <Star size={12} className="fill-accent text-accent flex-shrink-0" />}
                                    </div>
                                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark truncate">
                                        {note.preview}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-text-muted-light dark:text-text-muted-dark">
                                    <span>{note.date}</span>
                                    <div className="flex items-center gap-1">
                                        {note.tags.slice(0, 2).map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-2 py-1 bg-surface-hover dark:bg-surface-input rounded"
                                            >
                        {tag}
                      </span>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // 더보기 메뉴
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-surface-hover dark:hover:bg-surface-input rounded transition-opacity"
                                >
                                    <MoreHorizontal size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}