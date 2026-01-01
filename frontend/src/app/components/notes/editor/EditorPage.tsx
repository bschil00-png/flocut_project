"use client";

import { useParams, useRouter } from "next/navigation";
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

export default function EditorPage() {
  const router = useRouter();
  const { sessionId, id: noteId } = useParams<{
    sessionId: string;
    id: string;
  }>();

  const isNew = noteId === "new";

  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [panelMode, setPanelMode] =
    useState<ContextPanelMode>("properties");

  return (
    <div className="flex-1 flex overflow-hidden">
      <EditorContainer
        noteId={noteId}
        sessionId={Number(sessionId)}
        isNew={isNew}
        onCreated={(createdNoteId) => {
          router.replace(
            `/workspace/${sessionId}/notes/${createdNoteId}`
          );
        }}
        onToggleRightPanel={() =>
          setRightPanelOpen(!rightPanelOpen)
        }
        onAIAction={(mode) =>
          setPanelMode(`ai-${mode}` as ContextPanelMode)
        }
        rightPanelOpen={rightPanelOpen}
      />

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
