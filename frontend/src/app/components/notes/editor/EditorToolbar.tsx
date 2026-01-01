// src/app/components/editor/EditorToolbar.tsx
"use client";

import { useState } from "react";
import {
  Edit3,
  Eye,
  Sparkles,
  MessageSquare,
  GitCompare,
  Calendar,
} from "lucide-react";

import IconButton from "@/app/components/ui/icon-button/IconButton";
import VoiceRecorder from "@/app/components/layout/ai/VoiceRecorder";
import DocumentCompare from "@/app/components/layout/ai/DocumentCompare";

interface Props {
  isEditing: boolean;
  saving?: boolean;
  onSave: () => void;
  onToggleEdit: () => void;
  onAIAction: (m: "summary" | "feedback" | "compare") => void;
  onToggleRightPanel: () => void;
  rightPanelOpen: boolean;
  editorContent: string;
}


export default function EditorToolbar({
                                        isEditing,
                                        saving,
                                        onSave,
                                        onToggleEdit,
                                        onAIAction,
                                        onToggleRightPanel,
                                        rightPanelOpen,
                                        editorContent,
                                      }: Props) {

  const [voiceOpen, setVoiceOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);

  return (
    <>
      <div className="h-12 px-6 border-b border-border-light dark:border-border-dark flex items-center justify-between bg-background-light dark:bg-background-dark">

        {/* 왼쪽 */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleEdit}
            className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2
                            ${isEditing ? "bg-accent text-white" : "bg-surface-light dark:bg-surface-dark"}`}
          >
            {isEditing ? <Edit3 size={16} /> : <Eye size={16} />}
            {isEditing ? "편집 중" : "보기"}
          </button>

          {isEditing && (
            <button
              className="px-4 py-2 rounded-md bg-accent/10 text-accent text-sm"
              onClick={() => setVoiceOpen(true)}
            >
              음성 녹음
            </button>
          )}
        </div>

        {/* 오른쪽 */}
        <div className="flex items-center gap-2">

          <button
            className="px-3 py-1.5 rounded-md text-sm text-accent hover:bg-accent/10 flex items-center gap-1"
            onClick={() => onAIAction("summary")}
          >
            <Sparkles size={14} /> 요약
          </button>

          <button
            className="px-3 py-1.5 rounded-md text-sm text-accent hover:bg-accent/10 flex items-center gap-1"
            onClick={() => onAIAction("feedback")}
          >
            <MessageSquare size={14} /> 피드백
          </button>

          <button
            className="px-3 py-1.5 rounded-md text-sm text-purple-500 hover:bg-purple-500/10 flex items-center gap-1"
            onClick={() => setCompareOpen(true)}
          >
            <GitCompare size={14} /> 비교
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="px-4 py-2 rounded-md bg-accent text-white text-sm"
          >
            {saving ? "저장 중..." : "저장"}
          </button>


          <div className="h-6 w-px bg-border-light dark:bg-border-dark" />

          <IconButton
            icon={<Calendar size={16} />}
            onClick={onToggleRightPanel}
            className={rightPanelOpen ? "bg-accent text-white" : ""}
          />
        </div>
      </div>

      {voiceOpen && (
        <VoiceRecorder
          onClose={() => setVoiceOpen(false)}
          onTranscriptionComplete={() => {}}
        />
      )}

      {compareOpen && (
        <DocumentCompare
          currentContent={editorContent}
          onClose={() => setCompareOpen(false)}
        />
      )}
    </>
  );
}
