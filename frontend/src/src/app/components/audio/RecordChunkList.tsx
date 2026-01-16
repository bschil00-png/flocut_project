"use client";

import { useState } from "react";
import { Mic, Loader2, Trash2, Copy, Check } from "lucide-react";
import { useRecordsBySession } from "@/hooks/audio/useRecordsBySession";
import { deleteRecordChunk } from "@/lib/rest/audio/audio.rest";
import EmptyState from "@/app/components/ui/empty-state/EmptyState";
import IconButton from "@/app/components/ui/icon-button/IconButton";
import Pagination from "@/app/components/ui/pagination/Pagination";
import { toast } from "sonner";

interface Props {
  sessionId: number;
  onInsertText?: (text: string) => void;
}

export default function RecordChunkList({
                                          sessionId,
                                          onInsertText,
                                        }: Props) {

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const { records, recordPage, loading, refetch } = useRecordsBySession(
    sessionId,
    currentPage,
    pageSize
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <EmptyState
        icon={<Mic size={48} />}
        title="녹음된 음성이 없습니다"
        description="음성 녹음을 시작해보세요"
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* 리스트 */}
      <div className="space-y-2">
        {records.map((record) => (
          <RecordChunkItem
            key={record.recordId}
            record={record}
            onDeleted={refetch}
          />
        ))}
      </div>

      {/* 페이지네이션 */}
      {recordPage && recordPage.totalPages > 1 && (
        <Pagination
          pageNumber={recordPage.pageNumber}
          totalPages={recordPage.totalPages}
          hasNext={recordPage.hasNext}
          hasPrevious={recordPage.hasPrevious}
          isFirst={recordPage.isFirst}
          isLast={recordPage.isLast}
          onChange={setCurrentPage}
        />
      )}
    </div>
  );
}


// 개별 음성 조각 아이템
interface RecordChunkItemProps {
  record: {
    recordId: number;
    content: string;
    createdAt: string;
    noteId?: number;
  };
  onDeleted?: () => void;
}

function RecordChunkItem({ record, onDeleted }: RecordChunkItemProps) {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 텍스트 복사
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(record.content);
      setCopied(true);
      toast.success("텍스트가 복사되었습니다");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("복사 실패");
    }
  };

  // 삭제
  const handleDelete = async () => {
    const confirmed = window.confirm("이 음성 조각을 삭제하시겠습니까?");
    if (!confirmed) return;

    setDeleting(true);

    try {
      await deleteRecordChunk(record.recordId);
      toast.success("삭제되었습니다");
      onDeleted?.();
    } catch (error) {
      console.error("삭제 실패:", error);
      toast.error("삭제 실패");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="group relative p-4 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark hover:bg-surface-light dark:hover:bg-surface-hover transition-all">

      {/* 상단: 아이콘 + 날짜 + 액션 */}
      <div className="flex items-start gap-3 mb-2">
        <div className="p-2 rounded-lg bg-accent-soft flex-shrink-0">
          <Mic size={14} className="text-accent" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
            {new Date(record.createdAt).toLocaleString("ko-KR", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </p>

          {/* 노트 연결 여부 */}
          {record.noteId && (
            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">
              노트에 반영됨
            </span>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <IconButton
            icon={copied ? <Check size={14} /> : <Copy size={14} />}
            onClick={handleCopy}
            aria-label="복사"
            disabled={deleting}
            className={copied ? "text-green-500" : ""}
          />
          <IconButton
            icon={deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            onClick={handleDelete}
            aria-label="삭제"
            disabled={deleting}
            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          />
        </div>
      </div>

      {/* 텍스트 내용 */}
      <p className="text-sm text-text-primary-light dark:text-text-primary-dark leading-relaxed pl-11">
        {record.content}
      </p>
    </div>
  );
}