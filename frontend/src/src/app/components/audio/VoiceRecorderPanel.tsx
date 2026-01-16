"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, Mic, Square, GripHorizontal } from "lucide-react";
import IconButton from "@/app/components/ui/icon-button/IconButton";
import { useWebSpeechRecorder } from "@/hooks/audio/useWebSpeechRecorder";
import { useMediaQuery } from "@/hooks/common/useMediaQuery";

type Props = {
    open: boolean;
    onClose: () => void;
    onTranscriptReady: (text: string) => void;
};

export default function VoiceRecorderPanel({
                                               open,
                                               onClose,
                                               onTranscriptReady,
                                           }: Props) {
    const isMobile = useMediaQuery("(max-width: 768px)");

    const {
        transcript,
        interimTranscript,
        startRecording,
        stopRecording,
        isRecording,
        isSupported,
        error,
    } = useWebSpeechRecorder();

    const panelRef = useRef<HTMLDivElement>(null);

    const [mounted, setMounted] = useState(false);

    const [position, setPosition] = useState({ x: 80, y: 80 });
    const dragOffset = useRef({ x: 0, y: 0 });
    const dragging = useRef(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!open) return;

        const handleMove = (e: MouseEvent) => {
            if (!dragging.current || isMobile) return;

            setPosition({
                x: e.clientX - dragOffset.current.x,
                y: e.clientY - dragOffset.current.y,
            });
        };

        const handleUp = () => {
            dragging.current = false;
        };

        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseup", handleUp);

        return () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseup", handleUp);
        };
    }, [isMobile, open]);

    if (!mounted || !open) return null;

    if (!isSupported) {
        return createPortal(
            <div
                className="fixed bottom-4 left-4 right-4 z-[1000]
                   rounded-xl border bg-background-light p-4 shadow-xl"
            >
                <p className="text-sm text-red-500">
                    이 브라우저는 음성 인식을 지원하지 않습니다.
                </p>
                <div className="mt-3 flex justify-end">
                    <IconButton icon={<X size={16} />} onClick={onClose} />
                </div>
            </div>,
            document.body
        );
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isMobile) return;

        dragging.current = true;
        dragOffset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };
    };

    const handleStop = () => {
        stopRecording();
        if (transcript.trim()) {
            onTranscriptReady(transcript.trim());
        }
        onClose();
    };

    return createPortal(
        <div
            ref={panelRef}
            onClick={(e) => e.stopPropagation()}
            style={
                isMobile
                    ? undefined
                    : {
                        left: position.x,
                        top: position.y,
                    }
            }
            className={`
        z-[1000]
        ${
                isMobile
                    ? `
              fixed bottom-0 left-0 right-0
              rounded-t-2xl
              border-t
            `
                    : `
              absolute
              w-[360px]
              rounded-xl
              border
            `
            }
        bg-background-light dark:bg-surface-dark
        border-border-light dark:border-border-dark
        shadow-xl
        animate-scaleIn
      `}
        >
            <div
                className={`
          flex items-center justify-between
          px-4 py-3
          border-b border-border-light dark:border-border-dark
          ${isMobile ? "cursor-default" : "cursor-move"}
        `}
                onMouseDown={handleMouseDown}
            >
                <div className="flex items-center gap-2 text-sm font-medium">
                    {!isMobile && <GripHorizontal size={16} />}
                    음성 녹음
                </div>

                <IconButton
                    icon={<X size={16} />}
                    onClick={onClose}
                    aria-label="닫기"
                />
            </div>

            <div className="p-4 space-y-4">
                <div className="min-h-[120px] rounded-md border p-3 text-sm whitespace-pre-wrap
                        bg-surface-light dark:bg-surface-input">
                    {transcript}
                    <span className="opacity-60">{interimTranscript}</span>
                </div>

                {error && (
                    <p className="text-xs text-red-500">
                        {error}
                    </p>
                )}

                <div className="flex justify-center">
                    {!isRecording ? (
                        <IconButton
                            icon={<Mic />}
                            onClick={startRecording}
                            aria-label="녹음 시작"
                        />
                    ) : (
                        <IconButton
                            icon={<Square />}
                            onClick={handleStop}
                            className="text-red-500"
                            aria-label="녹음 중지"
                        />
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
