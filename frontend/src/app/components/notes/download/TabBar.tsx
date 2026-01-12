"use client";

import { Sparkles, GitCompare, Calendar } from "lucide-react";
import {PanelTab} from "@/app/components/layout/WorkspaceLayout/workspace/panel/PanelHeader";

type Props = {
    type: "note" | "document" | "audio";
    currentTab: PanelTab;
    onChangeTab: (tab: PanelTab) => void;
};

export default function TabBar({ type, currentTab, onChangeTab }: Props) {
    return (
        <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar-hide">
            <TabButton
                label="편집"
                active={currentTab === "edit"}
                onClick={() => onChangeTab("edit")}
            />
            <TabButton
                label="요약"
                icon={<Sparkles size={14} />}
                active={currentTab === "summary"}
                onClick={() => onChangeTab("summary")}
                disabled={type === "audio"}
            />
            <TabButton
                label="비교"
                icon={<GitCompare size={14} />}
                active={currentTab === "compare"}
                onClick={() => onChangeTab("compare")}
                disabled={true}
                badge="준비중"
            />
            <TabButton
                label="일정"
                icon={<Calendar size={14} />}
                active={currentTab === "calendar"}
                onClick={() => onChangeTab("calendar")}
                disabled={type !== "note"}
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
                   }: {
    label: string;
    icon?: React.ReactNode;
    active: boolean;
    disabled?: boolean;
    badge?: string;
    onClick: () => void;
}) {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`
        relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors whitespace-nowrap
        ${active ? "bg-accent text-white" : "text-text-primary-light dark:text-text-primary-dark hover:bg-accent-soft"}
        disabled:opacity-40 disabled:cursor-not-allowed
      `}
        >
            {icon}
            <span className="hidden sm:inline">{label}</span>
            {badge && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-semibold rounded bg-yellow-500 text-white">
          {badge}
        </span>
            )}
        </button>
    );
}