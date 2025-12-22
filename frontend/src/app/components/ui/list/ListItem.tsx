"use client";
import React from "react";

// 클릭 가능한 하나의 단위 컴포넌트
// 검색 결과 , 노트 , 요약 등등에서 사용 예정
export type ListItemProps = {
  title: string;
  description?: string;
  meta?: string;
  icon?: React.ReactNode;
  selected?: boolean;
} & Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
>;

export default function ListItem({
                                   title,
                                   description,
                                   meta,
                                   icon,
                                   selected = false,
                                   className = "",
                                   ...props // onClick, onKeyDown, aria-*, data-* 전부 여기
                                 }: ListItemProps) {
  return (
    // 이 요소가 리스트의 한 항목임을 명시
    // tabIndex 키보드로 포커스 가능하게 만듦
    // selected는 "현재 위치"
    // hover는 의도
    <div
      tabIndex={0} // 키보드 포커스 가능
      role="button" // 스크린 리더용
      aria-selected={selected}
      className={`
                flex items-start gap-3 px-3 py-2
                cursor-pointer rounded-md
                outline-none
                transition-colors

                text-text-primary-light dark:text-white

                hover:bg-accent-soft/60 dark:hover:bg-accent-soft/60
                ${selected ? "bg-accent-soft/60 dark:bg-accent-soft/60" : ""}

                focus-visible:ring-2 focus-visible:ring-accent

                ${className}
            `}
      {...props}
    >
      {icon && (
        <div className="mt-0.5 text-text-muted-light dark:text-white">
          {icon}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {title}
        </p>

        {description && (
          <p className="text-xs text-text-muted-light dark:text-text-muted-dark truncate">
            {description}
          </p>
        )}
      </div>

      {meta && (
        <span className="text-xs text-text-muted-light dark:text-text-muted-dark">
                    {meta}
                </span>
      )}
    </div>
  );
}
