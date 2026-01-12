
"use client";



import TabBar from "@/app/components/notes/download/TabBar";
import HeaderActions from "@/app/components/notes/header/HeaderActions";

export type PanelTab = "edit" | "summary" | "compare" | "calendar";

type Props = {
    type: "note" | "document" | "audio";
    currentTab: PanelTab;
    onChangeTab: (tab: PanelTab) => void;
    saved: boolean;
    saving: boolean;
    onSave: () => void;
    onClose: () => void;
    sessionId: number;
    noteId?: number;
    title?: string;
    content?: string;
    htmlContent?: string;
};

export default function PanelHeader({
                                        type,
                                        currentTab,
                                        onChangeTab,
                                        saved,
                                        saving,
                                        onSave,
                                        onClose,
                                        sessionId,
                                        noteId,
                                        title = "제목 없음",
                                        content = "",
                                        htmlContent,
                                    }: Props) {
    return (
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-light dark:border-border-dark bg-white dark:bg-surface-dark">
            <TabBar type={type} currentTab={currentTab} onChangeTab={onChangeTab} />

            <HeaderActions
                type={type}
                sessionId={sessionId}
                noteId={noteId}
                saved={saved}
                saving={saving}
                onSave={onSave}
                onClose={onClose}
                title={title}
                content={content}
                htmlContent={htmlContent}
            />
        </div>
    );
}