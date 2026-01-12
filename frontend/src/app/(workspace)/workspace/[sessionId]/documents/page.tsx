"use client";

import {useRouter, useParams} from "next/navigation";
import {useSessionFiles} from "@/hooks/files/useSessionFiles";
import FileUploadButton from "@/app/components/files/FileUploadButton";
import {useState, Fragment} from "react";
import Checkbox from "@/app/components/ui/form/Checkbox";
import DocumentListItem from "@/app/components/documents/DocumentListItem";
import {FileText, Loader2} from "lucide-react";
import Pagination from "@/app/components/ui/pagination/Pagination";

export default function DocumentsPage() {
    const router = useRouter();
    const {sessionId} = useParams<{ sessionId: string }>();

    //  서버 페이징을 위한 상태 (0-based)
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 20;

    const {filePage, files, loading, refetch} = useSessionFiles(
        Number(sessionId),
        currentPage,
        itemsPerPage
    );

    const [requestSummary, setRequestSummary] = useState(false);

    const openDetail = (fileId: number) => {
        router.push(`/workspace/${sessionId}?type=document&id=${fileId}`);
    };

    return (
        <div className="h-full flex flex-col bg-white dark:bg-slate-950 overflow-hidden">
            {/* Header */}
            <div
                className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-200">
                        문서
                    </h1>
                    <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {filePage?.totalElements || 0}개
          </span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="hidden sm:block">
                        <Checkbox
                            label="업로드 후 AI 요약"
                            checked={requestSummary}
                            onChange={setRequestSummary}
                        />
                    </div>
                    <FileUploadButton
                        sessionId={Number(sessionId)}
                        requestSummary={requestSummary}
                        onSuccess={refetch}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="animate-spin text-pink-500" size={32}/>
                    </div>
                ) : files.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-4">
                        <div
                            className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-4">
                            <FileText size={32} className="text-slate-400"/>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            문서가 없습니다
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                            첫 번째 문서를 업로드해보세요
                        </p>
                        <FileUploadButton
                            sessionId={Number(sessionId)}
                            requestSummary={requestSummary}
                            onSuccess={refetch}
                        />
                    </div>
                ) : (
                    <>
                        <div className="p-4 sm:p-6">
                            <div className="space-y-2">
                                {files.map((file) => (
                                    <div
                                        key={file.fileId}
                                        onClick={() => openDetail(file.fileId)}
                                        className="cursor-pointer"
                                    >
                                        <DocumentListItem
                                            file={file}
                                            sessionId={Number(sessionId)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/*  서버 페이징 메타데이터를 사용하도록 Pagination 교체 */}
                        {filePage && filePage.totalPages > 1 && (
                            <Pagination
                                pageNumber={filePage.pageNumber}
                                totalPages={filePage.totalPages}
                                hasNext={filePage.hasNext}
                                hasPrevious={filePage.hasPrevious}
                                isFirst={filePage.isFirst}
                                isLast={filePage.isLast}
                                onChange={(page) => setCurrentPage(page)}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}