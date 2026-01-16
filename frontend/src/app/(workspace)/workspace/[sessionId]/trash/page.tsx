"use client";

import { useState, Fragment, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trash2, Loader2, RotateCcw, X } from "lucide-react";

import { useNotesByStatus } from "@/hooks/notes/useNotesByStatus";
import { useNoteAction } from "@/hooks/notes/useNoteAction";
import { hardDeleteNote } from "@/lib/rest/note/notes.rest";

import Button from "@/app/components/ui/button/Button";
import EmptyState from "@/app/components/ui/empty-state/EmptyState";
import IconButton from "@/app/components/ui/icon-button/IconButton";
import { NoteListItem } from "@/lib/graphql/note/note.type";
import { toast } from "sonner";

type SortBy = "recent" | "created" | "title";

export default function TrashPage() {
    const router = useRouter();
    const { sessionId } = useParams<{ sessionId: string }>();

    const [sortBy, setSortBy] = useState<SortBy>("recent");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const { notes, loading, refetch } = useNotesByStatus(
        Number(sessionId),
        "DELETED"
    );
    const { handleRestore } = useNoteAction();

    const sortedNotes = useMemo(() => {
        if (!notes) return [];

        const sorted = [...notes];

        switch (sortBy) {
            case "recent":
                return sorted.sort((a, b) => {
                    const dateA = new Date(a.deletedAt || a.moddate || a.regdate || 0).getTime();
                    const dateB = new Date(b.deletedAt || b.moddate || b.regdate || 0).getTime();
                    return dateB - dateA;
                });
            case "created":
                return sorted.sort((a, b) => {
                    const dateA = new Date(a.regdate || 0).getTime();
                    const dateB = new Date(b.regdate || 0).getTime();
                    return dateB - dateA;
                });
            case "title":
                return sorted.sort((a, b) => {
                    const titleA = (a.title || "제목 없음").toLowerCase();
                    const titleB = (b.title || "제목 없음").toLowerCase();
                    return titleA.localeCompare(titleB, "ko-KR");
                });
            default:
                return sorted;
        }
    }, [notes, sortBy]);

    const paginatedNotes = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return sortedNotes.slice(startIndex, endIndex);
    }, [sortedNotes, currentPage]);

    const totalPages = Math.ceil(sortedNotes.length / itemsPerPage);

    const handleRestoreNote = (noteId: number) => {
        handleRestore(noteId, () => {
            refetch();
        });
    };

    //  영구삭제 핸들러
    const handlePermanentDelete = async (noteId: number) => {
        const confirmed = window.confirm(
            "영구 삭제된 노트는 복구할 수 없습니다. 계속하시겠습니까?"
        );

        if (!confirmed) return;

        try {
            await hardDeleteNote(noteId);
            toast.success("노트가 영구 삭제되었습니다.");
            refetch();
        } catch (error) {
            console.error("영구삭제 실패:", error);
            toast.error("영구삭제에 실패했습니다.");
        }
    };

    const handleBack = () => {
        router.push(`/workspace/${sessionId}`);
    };

    return (
        <div className="h-full flex flex-col bg-background-light dark:bg-background-dark">
            {/* 헤더 */}
            <div className="flex-shrink-0 border-b border-border-light dark:border-border-dark bg-white dark:bg-surface-dark px-4 sm:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <IconButton
                            icon={<X size={20} />}
                            onClick={handleBack}
                            aria-label="닫기"
                        />
                        <div>
                            <h1 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                                휴지통
                            </h1>
                            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                                {sortedNotes.length}개의 삭제된 노트
                            </p>
                        </div>
                    </div>

                    {/* 정렬 */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortBy)}
                        className="px-3 py-1.5 rounded-lg text-sm bg-surface-light dark:bg-surface-input border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark cursor-pointer hover:bg-accent-soft transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                        <option value="recent">최신순</option>
                        <option value="title">제목순</option>
                        <option value="created">생성순</option>
                    </select>
                </div>
            </div>

            {/* 본문 */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="animate-spin text-accent" size={32} />
                    </div>
                ) : sortedNotes.length === 0 ? (
                    <EmptyState
                        icon={<Trash2 size={48} />}
                        title="휴지통이 비어있습니다"
                        description="삭제된 노트가 없습니다"
                    />
                ) : (
                    <>
                        <div className="space-y-2">
                            {paginatedNotes.map((note) => (
                                <TrashItem
                                    key={note.noteId}
                                    note={note}
                                    onRestore={() => handleRestoreNote(note.noteId)}
                                    onPermanentDelete={() => handlePermanentDelete(note.noteId)}
                                />
                            ))}
                        </div>

                        {/* 페이지네이션 */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-8">
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(
                                        (page) =>
                                            page === 1 ||
                                            page === totalPages ||
                                            (page >= currentPage - 2 && page <= currentPage + 2)
                                    )
                                    .map((page, idx, arr) => (
                                        <Fragment key={page}>
                                            {idx > 0 && arr[idx - 1] !== page - 1 && (
                                                <span className="px-2 text-text-muted-light dark:text-text-muted-dark">
                                                    ...
                                                </span>
                                            )}
                                            <button
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                                    currentPage === page
                                                        ? "bg-accent text-white"
                                                        : "text-text-primary-light dark:text-text-primary-dark hover:bg-surface-light dark:hover:bg-surface-input"
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        </Fragment>
                                    ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

// 휴지통 아이템 컴포넌트
function TrashItem({
                       note,
                       onRestore,
                       onPermanentDelete,
                   }: {
    note: NoteListItem;
    onRestore: () => void;
    onPermanentDelete: () => void;
}) {
    return (
        <div className="flex items-center gap-4 px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark hover:bg-surface-light dark:hover:bg-surface-input transition-colors">
            <Trash2 size={16} className="text-red-500 flex-shrink-0" />

            <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm text-text-primary-light dark:text-text-primary-dark truncate">
                    {note.title || "제목 없음"}
                </h3>
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                    삭제일:{" "}
                    {note.deletedAt || note.moddate
                        ? new Date(note.deletedAt || note.moddate!).toLocaleDateString("ko-KR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })
                        : "알 수 없음"}
                </p>
            </div>

            <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={onRestore}>
                    <RotateCcw size={14} />
                    복구
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onPermanentDelete}
                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                    <Trash2 size={14} />
                    영구삭제
                </Button>
            </div>
        </div>
    );
}