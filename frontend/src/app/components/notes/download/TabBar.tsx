"use client";

import { Sparkles, GitCompare, Calendar, Edit3 } from "lucide-react";
import { PanelTab } from "@/app/components/layout/WorkspaceLayout/workspace/panel/PanelHeader";
import { useMediaQuery } from "@/hooks/common/useMediaQuery";

type Props = {
    type: "note" | "document" | "audio";
    currentTab: PanelTab;
    onChangeTab: (tab: PanelTab) => void;
};

export default function TabBar({ type, currentTab, onChangeTab }: Props) {
    //  모바일 / 좁은 패널 기준
    const isCompact = useMediaQuery("(max-width: 640px)");

    return (
        <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar-hide">
            <TabButton
                label="편집"
                icon={<Edit3 size={14} />}
                active={currentTab === "edit"}
                onClick={() => onChangeTab("edit")}
                compact={isCompact}
            />

            <TabButton
                label="요약"
                icon={<Sparkles size={14} />}
                active={currentTab === "summary"}
                onClick={() => onChangeTab("summary")}
                disabled={type === "audio"}
                compact={isCompact}
            />

            <TabButton
                label="비교"
                icon={<GitCompare size={14} />}
                active={currentTab === "compare"}
                onClick={() => onChangeTab("compare")}
                disabled
                badge="준비중"
                compact={isCompact}
            />

            <TabButton
                label="일정"
                icon={<Calendar size={14} />}
                active={currentTab === "calendar"}
                onClick={() => onChangeTab("calendar")}
                disabled={type !== "note"}
                compact={isCompact}
            />
        </div>
    );
}

function TabButton({
                       label,
                       icon,
                       active,
                       disabled,
                       badge,
                       onClick,
                       compact,
                   }: {
    label: string;
    icon?: React.ReactNode;
    active: boolean;
    disabled?: boolean;
    badge?: string;
    compact: boolean;
    onClick: () => void;
}) {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            aria-label={label}
            title={compact ? label : undefined}
            className={`
        relative flex items-center justify-center gap-1.5
        ${compact ? "w-9 h-9 p-0" : "px-3 py-1.5"}
        rounded-lg text-sm transition-colors whitespace-nowrap
        ${
                active
                    ? "bg-accent text-white"
                    : "text-text-primary-light dark:text-text-primary-dark hover:bg-accent-soft"
            }
        disabled:opacity-40 disabled:cursor-not-allowed
      `}
        >
            {icon}

            {/*  텍스트는 compact 아닐 때만 렌더링 */}
            {!compact && <span>{label}</span>}

            {badge && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-semibold rounded bg-yellow-500 text-white">
          {badge}
        </span>
            )}
        </button>
    );
}
