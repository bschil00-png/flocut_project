"use client";

import { useState } from "react";
import EditorContainer from "@/app/components/notes/editor/EditorContainer";
import ContextPanel from "@/app/components/layout/WorkspaceLayout/ContextPanel";

type ContextPanelMode =
    | "properties"
    | "ai-summary"
    | "ai-feedback"
    | "ai-compare"
    | "versions"
    | "comments"
    | "calendar";

interface EditorPageProps {
    noteId: string;
}

export default function EditorPage({ noteId }: EditorPageProps) {
    const [rightPanelOpen, setRightPanelOpen] = useState(false);
    const [panelMode, setPanelMode] = useState<ContextPanelMode>("properties");

    const openPanel = (mode: ContextPanelMode) => {
        setPanelMode(mode);
        setRightPanelOpen(true);
    };

    return (
        <div className="flex-1 flex overflow-hidden">
            {/* 에디터 영역 */}
            <EditorContainer
                noteId={noteId}
                onAIAction={(mode) => openPanel(`ai-${mode}` as ContextPanelMode)}
                onToggleRightPanel={() => setRightPanelOpen(!rightPanelOpen)}
                rightPanelOpen={rightPanelOpen}
            />

            {/* 컨텍스트 패널 */}
            {rightPanelOpen && (
                <ContextPanel
                    mode={panelMode}
                    noteId={noteId}
                    onClose={() => setRightPanelOpen(false)}
                    onChangeMode={setPanelMode}
                />
            )}
        </div>
    );
}