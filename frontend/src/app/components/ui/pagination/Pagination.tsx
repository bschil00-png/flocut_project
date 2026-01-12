"use client";

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
            <button
                disabled={isFirst}
                onClick={() => onChange(0)}
                className="px-2 py-1 text-sm border rounded disabled:opacity-40"
            >
                처음
            </button>

            <button
                disabled={!hasPrevious}
                onClick={() => onChange(pageNumber - 1)}
                className="px-2 py-1 text-sm border rounded disabled:opacity-40"
            >
                이전
            </button>

            <span className="text-sm">
        {pageNumber + 1} / {totalPages}
      </span>

            <button
                disabled={!hasNext}
                onClick={() => onChange(pageNumber + 1)}
                className="px-2 py-1 text-sm border rounded disabled:opacity-40"
            >
                다음
            </button>

            <button
                disabled={isLast}
                onClick={() => onChange(totalPages - 1)}
                className="px-2 py-1 text-sm border rounded disabled:opacity-40"
            >
                끝
            </button>
        </div>
    );
}
