"use client";

import { useState, useRef, useCallback } from "react";
import { RecordingState, WhisperOptions } from "@/lib/graphql/audio/audio.type";
import { uploadAndTranscribeAudio } from "@/lib/rest/audio/audio.rest";

interface UseWhisperRecorderProps extends WhisperOptions {
  sessionId: number;
  noteId?: number;
}
// 유료
export function useWhisperRecorder({
                                     sessionId,
                                     noteId,
                                     language = "ko",
                                     ...options
                                   }: UseWhisperRecorderProps) {
  // const [state, setState] = useState<RecordingState>("idle");
  // const [transcript, setTranscript] = useState("");
  // const [recordId, setRecordId] = useState<number | null>(null);
  // const [duration, setDuration] = useState(0);
  // const [error, setError] = useState<string | null>(null);
  //
  // const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  // const chunksRef = useRef<Blob[]>([]);
  // const startTimeRef = useRef<number>(0);
  // const timerRef = useRef<NodeJS.Timeout | null>(null);
  //
  // const startRecording = useCallback(async () => {
  //   try {
  //     setState("recording");
  //     setError(null);
  //     setDuration(0);
  //     chunksRef.current = [];
  //
  //     const stream = await navigator.mediaDevices.getUserMedia({
  //       audio: {
  //         echoCancellation: true,
  //         noiseSuppression: true,
  //         autoGainControl: true,
  //       }
  //     });
  //
  //     const mediaRecorder = new MediaRecorder(stream, {
  //       mimeType: "audio/webm;codecs=opus"
  //     });
  //
  //     mediaRecorderRef.current = mediaRecorder;
  //     startTimeRef.current = Date.now();
  //
  //     timerRef.current = setInterval(() => {
  //       setDuration((Date.now() - startTimeRef.current) / 1000);
  //     }, 100);
  //
  //     mediaRecorder.ondataavailable = (e) => {
  //       if (e.data.size > 0) {
  //         chunksRef.current.push(e.data);
  //       }
  //     };
  //
  //     mediaRecorder.onstop = async () => {
  //       if (timerRef.current) {
  //         clearInterval(timerRef.current);
  //         timerRef.current = null;
  //       }
  //
  //       const blob = new Blob(chunksRef.current, { type: "audio/webm" });
  //       const recordDuration = (Date.now() - startTimeRef.current) / 1000;
  //
  //       setDuration(recordDuration);
  //       setState("processing");
  //
  //       try {
  //         // 백엔드 STT API 호출
  //         const result = await uploadAndTranscribeAudio(
  //           blob,
  //           sessionId,
  //           noteId,
  //           language
  //         );
  //
  //         setRecordId(result.recordId);
  //         setTranscript(result.transcript);
  //         setState("completed");
  //       } catch (err: any) {
  //         console.error("STT 오류:", err);
  //         setError(err.message || "음성 인식 실패");
  //         setState("error");
  //       }
  //
  //       stream.getTracks().forEach(track => track.stop());
  //     };
  //
  //     mediaRecorder.start(1000);
  //   } catch (err: any) {
  //     console.error("녹음 오류:", err);
  //     setError(err.message || "마이크 접근 실패");
  //     setState("error");
  //   }
  // }, [sessionId, noteId, language]);
  //
  // const stopRecording = useCallback(() => {
  //   if (mediaRecorderRef.current?.state === "recording") {
  //     mediaRecorderRef.current.stop();
  //   }
  //
  //   if (timerRef.current) {
  //     clearInterval(timerRef.current);
  //     timerRef.current = null;
  //   }
  // }, []);
  //
  // const reset = useCallback(() => {
  //   setState("idle");
  //   setTranscript("");
  //   setRecordId(null);
  //   setDuration(0);
  //   setError(null);
  //   chunksRef.current = [];
  //
  //   if (timerRef.current) {
  //     clearInterval(timerRef.current);
  //     timerRef.current = null;
  //   }
  // }, []);
  //
  // return {
  //   state,
  //   transcript,
  //   recordId,
  //   duration,
  //   error,
  //   startRecording,
  //   stopRecording,
  //   reset,
  //   isRecording: state === "recording",
  //   isProcessing: state === "processing",
  // };
}