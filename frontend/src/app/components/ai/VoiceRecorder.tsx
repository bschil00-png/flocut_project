// src/app/components/ai/VoiceRecorder.tsx
"use client";

import { useState } from "react";
import { X, Mic, StopCircle, Loader2 } from "lucide-react";
import IconButton from "@/app/components/ui/icon-button/IconButton";
import Button from "@/app/components/ui/button/Button";

interface VoiceRecorderProps {
  onClose: () => void;
  onTranscriptionComplete: (text: string) => void;
}

export default function VoiceRecorder({ onClose, onTranscriptionComplete }: VoiceRecorderProps) {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);

  const startRecording = () => {
    setRecording(true);
  };

  const stopRecording = () => {
    setRecording(false);
    setLoading(true);

    // Mock transcription
    setTimeout(() => {
      setLoading(false);
      onTranscriptionComplete("음성 내용이 텍스트로 변환되었습니다.");
      onClose();
    }, 1500);
  };

  return (
    <div
      className="
                fixed inset-0 bg-black/30 backdrop-blur-sm
                flex items-center justify-center z-[999]
            "
    >
      <div
        className="
                    bg-surface-light dark:bg-surface-dark
                    w-[420px] rounded-xl shadow-xl border
                    border-border-light dark:border-border-dark
                    p-6 flex flex-col gap-6
                "
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">음성 녹음</h2>
          <IconButton icon={<X size={18} />} onClick={onClose} />
        </div>

        {/* Recorder UI */}
        <div className="flex flex-col items-center gap-4 py-6">
          {loading ? (
            <>
              <Loader2 className="w-10 h-10 text-accent animate-spin" />
              <span className="text-sm text-text-muted-light dark:text-text-muted-dark">
                                음성 처리 중…
                            </span>
            </>
          ) : recording ? (
            <>
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                <StopCircle className="text-red-500" size={40} />
              </div>
              <p className="text-sm text-red-500">녹음 중…</p>
              <Button variant="primary" onClick={stopRecording}>
                녹음 종료
              </Button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                <Mic className="text-accent" size={40} />
              </div>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                음성을 녹음하여 문서에 추가할 수 있어요
              </p>
              <Button variant="primary" onClick={startRecording}>
                녹음 시작
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
