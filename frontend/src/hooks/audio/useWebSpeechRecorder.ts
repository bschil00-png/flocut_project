"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { RecordingState } from "@/lib/graphql/audio/audio.type";

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

interface Props {
  language?: string;
  continuous?: boolean;
}

export function useWebSpeechRecorder({
                                       language = "ko-KR",
                                       continuous = true
                                     }: Props = {}) {
  const [state, setState] = useState<RecordingState>("idle");
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 브라우저 지원 확인
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setError("이 브라우저는 음성 인식을 지원하지 않습니다. Chrome을 사용해주세요.");
    }
  }, []);

  const startRecording = useCallback(() => {
    if (!isSupported) {
      setError("음성 인식이 지원되지 않습니다.");
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

      // 설정
      recognition.continuous = continuous;
      recognition.interimResults = true;
      recognition.lang = language;

      // 시간 측정 시작
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setDuration((Date.now() - startTimeRef.current) / 1000);
      }, 100);

      // 결과 수신
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = "";
        let interim = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcriptPart = result[0].transcript;

          if (result.isFinal) {
            finalTranscript += transcriptPart + " ";
          } else {
            interim += transcriptPart;
          }
        }

        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
        }
        setInterimTranscript(interim);
      };

      // 에러 처리
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("음성 인식 오류:", event);

        let errorMessage = "음성 인식 오류";

        switch (event.error) {
          case "no-speech":
            errorMessage = "음성이 감지되지 않았습니다.";
            break;
          case "audio-capture":
            errorMessage = "마이크에 접근할 수 없습니다.";
            break;
          case "not-allowed":
            errorMessage = "마이크 권한이 거부되었습니다.";
            break;
          case "network":
            errorMessage = "네트워크 오류가 발생했습니다.";
            break;
          default:
            errorMessage = event.message || "음성 인식 실패";
        }

        setError(errorMessage);
        setState("error");

        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };

      // 종료 처리
      recognition.onend = () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }

        if (state === "recording") {
          setState("completed");
        }
      };

      recognition.start();

    } catch (err: any) {
      console.error("녹음 시작 실패:", err);
      setError(err.message || "녹음 시작 실패");
      setState("error");
    }
  }, [isSupported, continuous, language, state]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

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

  return {
    state,
    transcript,
    interimTranscript, // 실시간 중간 결과
    duration,
    error,
    isSupported,
    startRecording,
    stopRecording,
    reset,
    isRecording: state === "recording",
  };
}