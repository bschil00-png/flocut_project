"use client";

import { Mic, Square, Save, RotateCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Button from "@/app/components/ui/button/Button";
import Modal from "@/app/components/ui/modal/Modal";
import { useWhisperRecorder } from "@/hooks/audio/useWhisperRecorder";
import { appendRecordsToNote } from "@/lib/rest/audio/audio.rest";

interface Props {
  open: boolean;
  onClose: () => void;
  sessionId: number;
  noteId?: number;
  onTranscriptReady?: (text: string) => void;
}
// 유료
// export default function VoiceRecorderEX({
//                                         open,
//                                         onClose,
//                                         sessionId,
//                                         noteId,
//                                         onTranscriptReady
//                                       }: Props) {
//   const {
//     state,
//     transcript,
//     recordId,
//     duration,
//     error,
//     startRecording,
//     stopRecording,
//     reset,
//     isRecording,
//     isProcessing,
//   } = useWhisperRecorder({
//     sessionId,
//     noteId,
//     language: "ko"
//   });
//
//   // 노트에 추가
//   const handleAddToNote = async () => {
//     if (!transcript.trim()) {
//       toast.error("인식된 텍스트가 없습니다.");
//       return;
//     }
//
//     try {
//       // 1. 노트에 병합 (백엔드에서 자동으로 처리)
//       if (noteId && recordId) {
//         await appendRecordsToNote(noteId, sessionId);
//       }
//
//       // 2. 에디터에 텍스트 삽입
//       onTranscriptReady?.(transcript);
//
//       toast.success("음성이 노트에 추가되었습니다.");
//       reset();
//       onClose();
//     } catch (error) {
//       console.error("노트 추가 실패:", error);
//       toast.error("노트 추가 실패");
//     }
//   };
//
//   return (
//     <Modal
//       open={open}
//       onCloseAction={onClose}
//       title="음성 녹음"
//       size="md"
//     >
//       <div className="flex flex-col items-center gap-6 py-6">
//
//         {/* 상태 표시 */}
//         <RecordingStatus
//           state={state}
//           duration={duration}
//           error={error}
//         />
//
//         {/* 컨트롤 */}
//         <div className="flex gap-3">
//           {state === "idle" && (
//             <Button
//               variant="primary"
//               size="lg"
//               onClick={startRecording}
//             >
//               <Mic size={20} />
//               녹음 시작
//             </Button>
//           )}
//
//           {isRecording && (
//             <Button
//               variant="secondary"
//               size="lg"
//               onClick={stopRecording}
//             >
//               <Square size={20} />
//               중지
//             </Button>
//           )}
//
//           {state === "completed" && (
//             <>
//               {noteId && (
//                 <Button
//                   variant="primary"
//                   size="lg"
//                   onClick={handleAddToNote}
//                 >
//                   <Save size={20} />
//                   노트에 추가
//                 </Button>
//               )}
//               <Button
//                 variant="secondary"
//                 size="lg"
//                 onClick={reset}
//               >
//                 <RotateCcw size={20} />
//                 다시 녹음
//               </Button>
//             </>
//           )}
//         </div>
//
//         {/* 인식 텍스트 */}
//         {transcript && (
//           <div className="w-full">
//             <h4 className="text-sm font-semibold mb-2">
//               인식된 텍스트
//             </h4>
//             <div className="p-4 rounded-lg bg-surface-light dark:bg-surface-input border max-h-40 overflow-y-auto custom-scrollbar">
//               <p className="text-sm whitespace-pre-wrap">
//                 {transcript}
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </Modal>
//   );
// }
//
// // 상태 표시 컴포넌트 (이전과 동일)
// function RecordingStatus({ state, duration, error }: any) {
//   if (error) {
//     return (
//       <div className="flex flex-col items-center gap-2 text-red-500">
//         <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
//           <Mic size={32} />
//         </div>
//         <p className="text-sm font-medium">{error}</p>
//       </div>
//     );
//   }
//
//   if (state === "recording") {
//     return (
//       <div className="flex flex-col items-center gap-3">
//         <div className="w-20 h-20 rounded-full bg-red-500 animate-pulse flex items-center justify-center">
//           <Mic size={32} className="text-white" />
//         </div>
//         <p className="text-sm font-medium text-red-500">
//           녹음 중... {formatDuration(duration)}
//         </p>
//       </div>
//     );
//   }
//
//   if (state === "processing") {
//     return (
//       <div className="flex flex-col items-center gap-3">
//         <Loader2 size={48} className="animate-spin text-accent" />
//         <p className="text-sm font-medium text-accent">
//           음성을 인식하고 있습니다...
//         </p>
//       </div>
//     );
//   }
//
//   if (state === "completed") {
//     return (
//       <div className="flex flex-col items-center gap-2 text-green-500">
//         <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
//           <Mic size={32} />
//         </div>
//         <p className="text-sm font-medium">
//           녹음 완료 ({formatDuration(duration)})
//         </p>
//       </div>
//     );
//   }
//
//   return (
//     <div className="flex flex-col items-center gap-2">
//       <div className="w-20 h-20 rounded-full bg-accent-soft flex items-center justify-center">
//         <Mic size={32} className="text-accent" />
//       </div>
//       <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
//         녹음 버튼을 눌러 시작하세요
//       </p>
//     </div>
//   );
// }
//
// function formatDuration(seconds: number): string {
//   const mins = Math.floor(seconds / 60);
//   const secs = Math.floor(seconds % 60);
//   return `${mins}:${secs.toString().padStart(2, "0")}`;
// }