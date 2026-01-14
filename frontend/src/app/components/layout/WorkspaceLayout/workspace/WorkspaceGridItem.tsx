"use client";

import { File, FileText, Mic } from "lucide-react";
import { WorkspaceItem } from "@/hooks/workspace/workspace";

type Props = {
    item: WorkspaceItem;
    selected: boolean;
    onToggleSelect: () => void;
    onClick: () => void;
    onDeleted: () => void;
};

export default function WorkspaceGridItem({
                                              item,
                                              selected,
                                              onToggleSelect,
                                              onClick,
                                          }: Props) {
    const icon = {
        note: <FileText size={32} />,
        document: <File size={32} />,
        audio: <Mic size={32} />,
    }[item.type];

    const formattedDate = item.date
        ? new Date(item.date).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
        : "";

    return (
        <div
            className={`
        group relative p-4 rounded-lg
        border border-border-light dark:border-border-dark
        bg-white dark:bg-surface-dark
        transition-colors cursor-pointer
        ${selected ? "bg-accent-soft border-accent" : ""}
      `}
            onClick={onClick}
        >
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={(e) => {
                        e.stopPropagation();
                        onToggleSelect();
                    }}
                    className="h-4 w-4 rounded border-border-light dark:border-border-dark text-accent"
                />
            </div>

            <div className="mb-3 text-text-muted-light dark:text-text-muted-dark">
                {icon}
            </div>

            <h3 className="text-sm font-medium truncate mb-1">
                {item.title}
            </h3>

            <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                {formattedDate}
            </p>
        </div>
    );
}
