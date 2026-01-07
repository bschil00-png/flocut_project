"use client";

import { Calendar, Clock, Tag, User } from "lucide-react";

//  이후에 noteId 연결
interface PropertiesContentProps {
  noteId: string;
}

export default function PropertiesContent({
                                            noteId,
                                          }: PropertiesContentProps) {
  //  임시 메타데이터 (나중에 API로 교체)
  const meta = {
    createdAt: "2024-12-16",
    updatedAt: "2시간 전",
    author: "김철수",
    tags: ["회의", "마케팅"],
    stats: {
      characters: 1234,
      words: 456,
      readTime: "3분",
    },
  };

  return (
    <div className="p-4 space-y-5">
      {/* 생성일 */}
      <MetaRow
        label="생성일"
        icon={<Calendar size={14} />}
        value={meta.createdAt}
      />

      {/* 마지막 수정 */}
      <MetaRow
        label="마지막 수정"
        icon={<Clock size={14} />}
        value={meta.updatedAt}
      />

      {/* 작성자 */}
      <div>
        <label className="block text-xs font-medium text-text-muted-light mb-2">
          작성자
        </label>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
            <User size={12} className="text-white" />
          </div>
          <span className="text-sm">{meta.author}</span>
        </div>
      </div>

      {/* 태그 */}
      <div>
        <label className="block text-xs font-medium text-text-muted-light mb-2">
          태그
        </label>
        <div className="flex flex-wrap gap-2">
          {meta.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 bg-surface-hover rounded text-xs"
            >
              <Tag size={12} />
              {tag}
            </span>
          ))}

          {/* 추후 태그 추가 버튼 */}
          <button className="px-2 py-1 border border-dashed rounded text-xs text-text-muted-light hover:border-accent">
            + 추가
          </button>
        </div>
      </div>

      {/* 문서 통계 */}
      <div>
        <label className="block text-xs font-medium text-text-muted-light mb-2">
          문서 통계
        </label>
        <div className="space-y-2 text-sm">
          <StatRow label="글자 수" value={meta.stats.characters} />
          <StatRow label="단어 수" value={meta.stats.words} />
          <StatRow label="예상 읽기 시간" value={meta.stats.readTime} />
        </div>
      </div>
    </div>
  );
}

// 임시 공통 함수

function MetaRow({
                   label,
                   icon,
                   value,
                 }: {
  label: string;
  icon: React.ReactNode;
  value: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-text-muted-light mb-2">
        {label}
      </label>
      <div className="flex items-center gap-2 text-sm">
        {icon}
        <span>{value}</span>
      </div>
    </div>
  );
}

function StatRow({
                   label,
                   value,
                 }: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-text-muted-light">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
