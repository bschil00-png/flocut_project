"use client";

import { useState } from "react";
import ContextPanel from "@/app/components/layout/WorkspaceLayout/ContextPanel";
import EditorContainer from "@/app/components/layout/editor/EditorContainer";

export default function EditorPage({ noteId }: { noteId: string }) {
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState("properties");

  const openPanel = (mode: any) => {
    setPanelMode(mode);
    setRightPanelOpen(true);
  };

  return (
    <div className="flex h-full">
      <EditorContainer
        noteId={noteId}
        onAIAction={openPanel}
        onToggleRightPanel={() => setRightPanelOpen(!rightPanelOpen)}
        rightPanelOpen={rightPanelOpen}
      />

      {rightPanelOpen && (
        <ContextPanel
          mode={panelMode as any}
          noteId={noteId}
          onClose={() => setRightPanelOpen(false)}
          onChangeMode={setPanelMode}
        />
      )}
    </div>
  );
}
