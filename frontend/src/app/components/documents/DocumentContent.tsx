// components/documents/DocumentContent.tsx
"use client";

import { useState, useRef } from "react";
import { Loader2, FileText, AlertCircle } from "lucide-react";
import { useFileText } from "@/hooks/files/useFileText";
import SummaryRequestButton from "@/app/components/summary/SummaryRequestButton";
import EmptyState from "@/app/components/ui/empty-state/EmptyState";
import Card from "@/app/components/ui/card/Card";
import ConfirmDialog from "@/app/components/ui/modal/ConfirmDialog";

type Props = {
  fileId: string;
  sessionId: number;
};

export default function DocumentContent({ fileId, sessionId }: Props) {
  const id = Number(fileId);
  const { text, loading, error } = useFileText(id);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // 버튼 엘리먼트에 직접 접근하기 위한 ref 생성
  const summaryBtnRef = useRef<HTMLButtonElement>(null);

  // 컨펌 완료 후 실제 요청 실행 로직
  const handleConfirmSummary = () => {
    setIsConfirmOpen(false);

    // 다이얼로그에서 '확인'을 눌렀을 때만 실제 버튼의 클릭 이벤트를 트리거합니다.
    if (summaryBtnRef.current) {
      summaryBtnRef.current.click();
    }
  };

  // 로딩 상태 처리
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <Loader2 className="animate-spin text-accent" size={32} />
        <p className="text-sm text-text-muted-light">문서를 읽어오는 중입니다...</p>
      </div>
    );
  }

  // 에러/빈 데이터 상태 처리
  if (error || !text || text.trim().length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <EmptyState
          title={error ? "파일을 불러올 수 없습니다" : "파일 내용이 비어있습니다"}
          description={error ? "원문을 불러오지 못했습니다." : "이 파일에는 추출된 텍스트 내용이 없습니다."}
          icon={error ? <AlertCircle size={48} className="text-red-500" /> : <FileText size={48} className="opacity-20" />}
          action={
            <SummaryRequestButton
              type="document"
              targetId={id}
              sessionId={sessionId}
              size="md"
            />
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark">
      {/* 헤더 영역 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border-light dark:border-border-dark bg-white dark:bg-background-dark/50 shadow-sm">
        <div className="flex items-center gap-2">
          <FileText size={20} className="text-accent" />
          <h4 className="font-bold text-lg text-text-primary-light dark:text-white">원본 파일</h4>
        </div>

        {/* 캡처링을 쓰지 않고 버튼을 감싸는 div에서 클릭을 가로챕니다.
          pointer-events-none을 통해 내부 버튼이 직접 클릭되는 것을 막고,
          div 클릭 시 다이얼로그를 띄웁니다.
        */}
        <div className="relative">
          <div
            className="absolute inset-0 z-10 cursor-pointer"
            onClick={() => setIsConfirmOpen(true)}
          />
          <SummaryRequestButton
            ref={summaryBtnRef}
            type="document"
            targetId={id}
            sessionId={sessionId}
          />
        </div>
      </div>

      {/* 원문 내용 영역 */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-surface-light/30 dark:bg-background-dark">
        <div className="max-w-4xl mx-auto p-8 lg:p-12">
          <Card variant="outlined" padding="none" className="border-none shadow-none bg-transparent">
            <pre className="whitespace-pre-wrap font-sans text-[15px] leading-[1.8] tracking-tight text-text-primary-light dark:text-text-primary-dark">
              {text}
            </pre>
          </Card>
        </div>
      </div>

      {/* 컨펌 다이얼로그 */}
      {isConfirmOpen && (
        <>
          {/*<ModalOverlay onClose={() => setIsConfirmOpen(false)} />*/}
          <ConfirmDialog
            open={isConfirmOpen}
            title="AI 요약 요청"
            message="해당 문서의 핵심 내용을 분석하고 요약을 생성하시겠습니까? 문서 길이에 따라 시간이 소요될 수 있습니다."
            confirmText="요약 시작"
            cancelText="취소"
            onConfirm={handleConfirmSummary}
            onClose={() => setIsConfirmOpen(false)}
          />
        </>
      )}
    </div>
  );
}