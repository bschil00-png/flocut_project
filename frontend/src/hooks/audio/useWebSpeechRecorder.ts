"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { RecordingState } from "@/lib/graphql/audio/audio.type";

/* =========================
   Web Speech API 타입 정의
========================= */

interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    abort: () => void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
}

declare global {
    interface Window {
        SpeechRecognition: new () => SpeechRecognition;
        webkitSpeechRecognition: new () => SpeechRecognition;
    }
}

/* =========================
   Hook Props
========================= */

interface Props {
    language?: string;
    continuous?: boolean;
}

/* =========================
   Hook
========================= */

export function useWebSpeechRecorder({
                                         language = "ko-KR",
                                         continuous = true,
                                     }: Props = {}) {
    /* =========================
       State
    ========================= */

    const [state, setState] = useState<RecordingState>("idle");
    const [transcript, setTranscript] = useState("");
    const [interimTranscript, setInterimTranscript] = useState("");
    const [duration, setDuration] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isSupported, setIsSupported] = useState(true);

    /* =========================
       Refs
    ========================= */

    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const startTimeRef = useRef<number>(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // onend에서 최신 state를 참조하기 위한 ref
    const stateRef = useRef<RecordingState>("idle");

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    /* =========================
       브라우저 지원 여부 체크
    ========================= */

    useEffect(() => {
        if (
            typeof window === "undefined" ||
            (!window.SpeechRecognition && !window.webkitSpeechRecognition)
        ) {
            setIsSupported(false);
            setError(
                "이 브라우저는 음성 인식을 지원하지 않습니다. Chrome을 사용해주세요."
            );
        }
    }, []);

    /* =========================
       녹음 시작
    ========================= */

    const startRecording = useCallback(async () => {
        if (!isSupported) {
            alert("이 브라우저는 음성 인식을 지원하지 않습니다.");
            return;
        }

        // 마이크 존재 / 권한 사전 체크
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch {
            alert("마이크가 없거나 접근 권한이 거부되었습니다.");
            return;
        }

        try {
            setState("recording");
            setError(null);
            setTranscript("");
            setInterimTranscript("");
            setDuration(0);

            const SpeechRecognition =
                window.SpeechRecognition || window.webkitSpeechRecognition;

            const recognition = new SpeechRecognition();
            recognitionRef.current = recognition;

            recognition.continuous = continuous;
            recognition.interimResults = true;
            recognition.lang = language;

            // 녹음 시간 측정
            startTimeRef.current = Date.now();
            timerRef.current = setInterval(() => {
                setDuration((Date.now() - startTimeRef.current) / 1000);
            }, 100);

            // 음성 인식 결과 처리
            recognition.onresult = (event: SpeechRecognitionEvent) => {
                let finalText = "";
                let interimText = "";

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const result = event.results[i];
                    const text = result[0].transcript;

                    if (result.isFinal) {
                        finalText += text + " ";
                    } else {
                        interimText += text;
                    }
                }

                if (finalText) {
                    setTranscript((prev) => prev + finalText);
                }

                setInterimTranscript(interimText);
            };

            // 에러 처리
            recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
                let message = "음성 인식 중 오류가 발생했습니다.";

                switch (event.error) {
                    case "no-speech":
                        message = "음성이 감지되지 않았습니다.";
                        break;
                    case "audio-capture":
                        message = "마이크를 찾을 수 없습니다.";
                        break;
                    case "not-allowed":
                        message = "마이크 사용 권한이 거부되었습니다.";
                        break;
                    case "network":
                        message = "네트워크 오류가 발생했습니다.";
                        break;
                }

                console.error("SpeechRecognition error:", event);
                alert(message);

                setError(message);
                setState("error");

                if (timerRef.current) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                }
            };

            // 녹음 종료 처리
            recognition.onend = () => {
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                }

                // 에러가 아닌 정상 종료일 때만 completed 처리
                if (stateRef.current === "recording") {
                    setState("completed");
                }
            };

            recognition.start();
        } catch (err: any) {
            console.error("녹음 시작 실패:", err);
            alert("음성 녹음을 시작할 수 없습니다.");
            setError(err?.message ?? "녹음 시작 실패");
            setState("error");
        }
    }, [isSupported, continuous, language]);

    /* =========================
       녹음 중지
    ========================= */

    const stopRecording = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }

        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    /* =========================
       초기화
    ========================= */

    const reset = useCallback(() => {
        setState("idle");
        setTranscript("");
        setInterimTranscript("");
        setDuration(0);
        setError(null);

        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    /* =========================
       Return
    ========================= */

    return {
        state,
        transcript,
        interimTranscript,
        duration,
        error,
        isSupported,
        startRecording,
        stopRecording,
        reset,
        isRecording: state === "recording",
    };
}
