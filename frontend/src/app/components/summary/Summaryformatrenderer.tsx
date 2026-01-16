"use client";

import { Sparkles, CheckCircle2, FileText } from "lucide-react";

type SummarySection = {
  title: string;
  content: string;
};

type Props = {
  mainTopic?: string | null;
  keyTakeaways?: string[] | null;
  sections?: SummarySection[] | null;
  finalDocument?: string | null;
};

//   요약 결과 컴포넌트
export default function SummaryFormatRenderer({
                                                mainTopic,
                                                keyTakeaways,
                                                sections,
                                                finalDocument,
                                              }: Props) {
  // 데이터가 없는 경우
  if (!finalDocument && !sections?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FileText size={40} className="text-accent opacity-20 mb-3" />
        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
          요약 내용이 없습니다
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/*  핵심 주제 */}
      {mainTopic && (
        <div className="p-4 rounded-xl bg-gradient-to-br from-accent/5 to-accent/10 border-l-4 border-accent">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <Sparkles size={20} className="text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-semibold text-accent uppercase tracking-wide mb-1">
                핵심 주제
              </h3>
              <p className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark leading-relaxed">
                {mainTopic}
              </p>
            </div>
          </div>
        </div>
      )}

      {/*  주요 포인트 */}
      {keyTakeaways && keyTakeaways.length > 0 && (
        <div className="p-4 rounded-xl bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={16} className="text-accent" />
            <h3 className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">
              주요 포인트
            </h3>
          </div>
          <ul className="space-y-2">
            {keyTakeaways.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm text-text-primary-light dark:text-text-primary-dark"
              >
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center mt-0.5">
                  {idx + 1}
                </span>
                <span className="flex-1 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/*  섹션별 내용 */}
      {sections && sections.length > 0 && (
        <div className="space-y-4">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark hover:border-accent/30 transition-colors"
            >
              <h4 className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark mb-2 pb-2 border-b border-border-light dark:border-border-dark">
                {section.title}
              </h4>
              <div
                className="text-sm leading-relaxed text-text-primary-light dark:text-text-primary-dark"
                style={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {section.content}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 전체 문서 (섹션이 없을 때만 표시) */}
      {finalDocument && (!sections || sections.length === 0) && (
        <div className="p-4 rounded-xl bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark">
          <div
            className="text-sm leading-relaxed text-text-primary-light dark:text-text-primary-dark"
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {finalDocument}
          </div>
        </div>
      )}
    </div>
  );
}