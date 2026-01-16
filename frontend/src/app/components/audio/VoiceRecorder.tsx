"use client";

import Modal from "@/app/components/ui/modal/Modal";
import IconButton from "../ui/icon-button/IconButton";
import { Mic, Square } from "lucide-react";
import { useWebSpeechRecorder } from "@/hooks/audio/useWebSpeechRecorder";

interface Props {
  open: boolean;
  onClose: () => void;
  onTranscriptReady: (text: string) => void;
}

export default function VoiceRecorder({
                                        open,
                                        onClose,
                                        onTranscriptReady,
                                      }: Props) {
  const {
    transcript,
    interimTranscript,
    startRecording,
    stopRecording,
    isRecording,
    isSupported,
  } = useWebSpeechRecorder();

  const handleStop = () => {
    stopRecording();
    if (transcript.trim()) {
      onTranscriptReady(transcript.trim());
    }
    onClose();
  };

  if (!isSupported) {
    return (
      <Modal open={open} onCloseAction={onClose} title="음성 녹음">
        <p className="text-sm text-red-500">
          이 브라우저는 음성 인식을 지원하지 않습니다. Chrome을 사용해주세요.
        </p>
      </Modal>
    );
  }

  return (
    <Modal open={open} onCloseAction={onClose} title="음성 녹음">
      <div className="space-y-6">

        {/* 실시간 텍스트 */}
        <div className="min-h-[120px] p-4 border rounded-md bg-surface-light text-sm whitespace-pre-wrap">
          {transcript}
          <span className="opacity-60">{interimTranscript}</span>
        </div>

        {/* 버튼 */}
        <div className="flex justify-center gap-4">
          {!isRecording ? (
            <IconButton
              icon={<Mic />}
              onClick={startRecording}
            />
          ) : (
            <IconButton
              icon={<Square />}
              onClick={handleStop}
              className="text-red-500"
            />
          )}
        </div>
      </div>
    </Modal>
  );
}
