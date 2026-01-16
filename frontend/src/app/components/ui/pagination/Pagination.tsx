"use client";

import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";

type Props = {
    pageNumber: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
    isFirst: boolean;
    isLast: boolean;
    onChange: (page: number) => void;
};

export default function Pagination({
                                       pageNumber,
                                       totalPages,
                                       hasNext,
                                       hasPrevious,
                                       isFirst,
                                       isLast,
                                       onChange,
                                   }: Props) {
    return (
        <div className="flex items-center justify-center gap-2 py-4">
            {/* 처음 */}
            <button
                disabled={isFirst}
                onClick={() => onChange(0)}
                className="
                    p-2 rounded-md
                    border border-border-light dark:border-border-dark
                    text-text-primary-light dark:text-text-primary-dark
                    hover:bg-accent-soft dark:hover:bg-accent-soft
                    disabled:opacity-40 disabled:cursor-not-allowed
                    transition-colors
                "
                aria-label="처음 페이지"
                title="처음"
            >
                <ChevronsLeft size={16} />
            </button>

            {/* 이전 */}
            <button
                disabled={!hasPrevious}
                onClick={() => onChange(pageNumber - 1)}
                className="
                    p-2 rounded-md
                    border border-border-light dark:border-border-dark
                    text-text-primary-light dark:text-text-primary-dark
                    hover:bg-accent-soft dark:hover:bg-accent-soft
                    disabled:opacity-40 disabled:cursor-not-allowed
                    transition-colors
                "
                aria-label="이전 페이지"
                title="이전"
            >
                <ChevronLeft size={16} />
            </button>

            {/* 페이지 정보 */}
            <span className="min-w-[80px] text-center text-sm text-text-primary-light dark:text-text-primary-dark">
                {pageNumber + 1} / {totalPages}
            </span>

            {/* 다음 */}
            <button
                disabled={!hasNext}
                onClick={() => onChange(pageNumber + 1)}
                className="
                    p-2 rounded-md
                    border border-border-light dark:border-border-dark
                    text-text-primary-light dark:text-text-primary-dark
                    hover:bg-accent-soft dark:hover:bg-accent-soft
                    disabled:opacity-40 disabled:cursor-not-allowed
                    transition-colors
                "
                aria-label="다음 페이지"
                title="다음"
            >
                <ChevronRight size={16} />
            </button>

            {/* 끝 */}
            <button
                disabled={isLast}
                onClick={() => onChange(totalPages - 1)}
                className="
                    p-2 rounded-md
                    border border-border-light dark:border-border-dark
                    text-text-primary-light dark:text-text-primary-dark
                    hover:bg-accent-soft dark:hover:bg-accent-soft
                    disabled:opacity-40 disabled:cursor-not-allowed
                    transition-colors
                "
                aria-label="마지막 페이지"
                title="끝"
            >
                <ChevronsRight size={16} />
            </button>
        </div>
    );
}