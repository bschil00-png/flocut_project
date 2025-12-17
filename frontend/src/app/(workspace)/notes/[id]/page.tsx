// app/(workspace)/notes/[id]/page.tsx
"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import ContextPanel from "@/app/components/layout/WorkspaceLayout/ContextPanel";
import EditorContainer from "@/app/components/layout/editor/EditorContainer";

export default function NotePage({
                                     params,
                                 }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const router = useRouter();
    const [contextPanelOpen, setContextPanelOpen] = useState(false);
    const [contextPanelMode, setContextPanelMode] = useState<
        "properties" | "ai-summary" | "ai-feedback" | "ai-compare" | "versions" | "comments"
    >("properties");

    const handleOpenContextPanel = (
        mode: "properties" | "ai-summary" | "ai-feedback" | "ai-compare" | "versions" | "comments"
    ) => {
        setContextPanelMode(mode);
        setContextPanelOpen(true);
    };

    return (
        <div className="flex h-full overflow-hidden">
            {/* 에디터 영역 */}
            <EditorContainer
                noteId={id}
                onOpenContextPanel={handleOpenContextPanel}
                contextPanelOpen={contextPanelOpen}
            />

            {/* 컨텍스트 패널 (우측) */}
            {contextPanelOpen && (
                <ContextPanel
                    mode={contextPanelMode}
                    noteId={id}
                    onClose={() => setContextPanelOpen(false)}
                    onChangeMode={setContextPanelMode}
                />
            )}
        </div>
    );
}