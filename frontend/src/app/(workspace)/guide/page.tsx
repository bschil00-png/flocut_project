// // app/guide/layout.tsx
// "use client";
//
// import { useState } from "react";
// import {
//   Book,
//   FileText,
//   Mic,
//   GitCompare,
//   MessageSquare,
//   Sparkles,
//   Upload,
//   Play,
//   ChevronRight,
//   CheckCircle2,
//   Lightbulb,
//   Zap,
//   Target,
//   Users,
//   GraduationCap,
//   Briefcase,
// } from "lucide-react";
//
// export default function GuidePage() {
//   const [activeSection, setActiveSection] = useState("quick-start");
//
//   const sections = [
//     {
//       id: "quick-start",
//       title: "빠른 시작",
//       icon: Zap,
//       color: "text-yellow-500",
//       bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
//     },
//     {
//       id: "upload-summarize",
//       title: "문서 업로드 & 요약",
//       icon: FileText,
//       color: "text-blue-500",
//       bgColor: "bg-blue-50 dark:bg-blue-900/20",
//     },
//     {
//       id: "voice-summarize",
//       title: "음성 파일 요약",
//       icon: Mic,
//       color: "text-green-500",
//       bgColor: "bg-green-50 dark:bg-green-900/20",
//     },
//     {
//       id: "compare-docs",
//       title: "문서 비교하기",
//       icon: GitCompare,
//       color: "text-purple-500",
//       bgColor: "bg-purple-50 dark:bg-purple-900/20",
//     },
//     {
//       id: "ai-feedback",
//       title: "AI 피드백",
//       icon: MessageSquare,
//       color: "text-pink-500",
//       bgColor: "bg-pink-50 dark:bg-pink-900/20",
//     },
//     {
//       id: "workspace",
//       title: "워크스페이스 활용",
//       icon: Book,
//       color: "text-indigo-500",
//       bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
//     },
//     {
//       id: "tips",
//       title: "팁 & 트릭",
//       icon: Lightbulb,
//       color: "text-orange-500",
//       bgColor: "bg-orange-50 dark:bg-orange-900/20",
//     },
//   ];
//
//   return (
//     <div className="min-h-screen bg-background-light dark:bg-background-dark">
//       {/* 헤더 */}
//       <header className="border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center">
//               <Book className="text-white" size={20} />
//             </div>
//             <div>
//               <h1 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
//                 사용 가이드
//               </h1>
//               <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
//                 FloCut을 효과적으로 활용하는 방법
//               </p>
//             </div>
//           </div>
//         </div>
//       </header>
//
//       <div className="max-w-7xl mx-auto px-6 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//           {/* 사이드바 네비게이션 */}
//           <aside className="lg:col-span-1">
//             <div className="sticky top-24 space-y-2">
//               <h3 className="text-xs font-semibold text-text-muted-light dark:text-text-muted-dark mb-4 px-3">
//                 목차
//               </h3>
//               {sections.map((section) => (
//                 <button
//                   key={section.id}
//                   onClick={() => setActiveSection(section.id)}
//                   className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
//                     activeSection === section.id
//                       ? "bg-accent text-white font-medium shadow-md"
//                       : "text-text-primary-light dark:text-text-primary-dark hover:bg-surface-hover dark:hover:bg-surface-input"
//                   }`}
//                 >
//                   <section.icon size={18} />
//                   <span className="text-sm">{section.title}</span>
//                 </button>
//               ))}
//             </div>
//           </aside>
//
//           {/* 메인 콘텐츠 */}
//           <main className="lg:col-span-3">
//             {activeSection === "quick-start" && <QuickStartSection />}
//             {activeSection === "upload-summarize" && <UploadSummarizeSection />}
//             {activeSection === "voice-summarize" && <VoiceSummarizeSection />}
//             {activeSection === "compare-docs" && <CompareDocsSection />}
//             {activeSection === "ai-feedback" && <AIFeedbackSection />}
//             {activeSection === "workspace" && <WorkspaceSection />}
//             {activeSection === "tips" && <TipsSection />}
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }
//
// // ===== 빠른 시작 섹션 =====
// function QuickStartSection() {
//   return (
//     <div className="space-y-8">
//       <div>
//         <div className="flex items-center gap-3 mb-4">
//           <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
//             <Zap className="text-white" size={24} />
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
//               빠른 시작
//             </h2>
//             <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
//               3분 안에 FloCut 시작하기
//             </p>
//           </div>
//         </div>
//
//         <p className="text-text-primary-light dark:text-text-primary-dark leading-relaxed mb-6">
//           FloCut은 문서와 음성을 AI로 요약하고, 여러 문서를 비교하며,
//           문서 작성에 대한 피드백을 제공하는 지능형 플랫폼입니다.
//         </p>
//       </div>
//
//       {/* 3단계 가이드 */}
//       <div className="space-y-4">
//         <StepCard
//           number={1}
//           title="문서 업로드"
//           description="PDF, DOCX, TXT 파일을 업로드하거나 음성 파일(MP3, WAV)을 선택하세요."
//           icon={Upload}
//           color="blue"
//         />
//         <StepCard
//           number={2}
//           title="AI 요약 받기"
//           description="업로드한 파일을 AI가 자동으로 분석하여 핵심 내용을 요약해드립니다."
//           icon={Sparkles}
//           color="purple"
//         />
//         <StepCard
//           number={3}
//           title="비교 & 피드백"
//           description="여러 문서를 비교하고, AI 피드백으로 문서를 개선하세요."
//           icon={GitCompare}
//           color="green"
//         />
//       </div>
//
//       {/* 타겟 사용자 */}
//       <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border border-accent/20 p-6">
//         <h3 className="text-lg font-bold mb-4 text-text-primary-light dark:text-text-primary-dark">
//           이런 분들께 추천합니다
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="flex items-start gap-3">
//             <div className="w-10 h-10 rounded-lg bg-accent-soft flex items-center justify-center flex-shrink-0">
//               <GraduationCap className="text-accent" size={20} />
//             </div>
//             <div>
//               <h4 className="font-semibold text-sm mb-1">대학생</h4>
//               <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
//                 강의 자료 정리, 레포트 작성
//               </p>
//             </div>
//           </div>
//           <div className="flex items-start gap-3">
//             <div className="w-10 h-10 rounded-lg bg-accent-soft flex items-center justify-center flex-shrink-0">
//               <Briefcase className="text-accent" size={20} />
//             </div>
//             <div>
//               <h4 className="font-semibold text-sm mb-1">직장인</h4>
//               <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
//                 회의록 정리, 보고서 작성
//               </p>
//             </div>
//           </div>
//           <div className="flex items-start gap-3">
//             <div className="w-10 h-10 rounded-lg bg-accent-soft flex items-center justify-center flex-shrink-0">
//               <Users className="text-accent" size={20} />
//             </div>
//             <div>
//               <h4 className="font-semibold text-sm mb-1">연구자</h4>
//               <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
//                 논문 분석, 연구 자료 정리
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
//
// // ===== 문서 업로드 & 요약 섹션 =====
// function UploadSummarizeSection() {
//   return (
//     <div className="space-y-8">
//       <div>
//         <div className="flex items-center gap-3 mb-4">
//           <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
//             <FileText className="text-white" size={24} />
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
//               문서 업로드 & 요약
//             </h2>
//             <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
//               문서를 업로드하고 AI 요약을 받는 방법
//             </p>
//           </div>
//         </div>
//       </div>
//
//       {/* 지원 파일 형식 */}
//       <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
//         <h3 className="font-bold mb-4">지원 파일 형식</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="p-4 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark">
//             <div className="text-2xl mb-2">📄</div>
//             <h4 className="font-semibold text-sm mb-1">PDF</h4>
//             <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
//               최대 200페이지, 20MB
//             </p>
//           </div>
//           <div className="p-4 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark">
//             <div className="text-2xl mb-2">📝</div>
//             <h4 className="font-semibold text-sm mb-1">DOCX</h4>
//             <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
//               워드 문서, 최대 20MB
//             </p>
//           </div>
//           <div className="p-4 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark">
//             <div className="text-2xl mb-2">📋</div>
//             <h4 className="font-semibold text-sm mb-1">TXT</h4>
//             <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
//               일반 텍스트 파일
//             </p>
//           </div>
//         </div>
//       </div>
//
//       {/* 단계별 가이드 */}
//       <div className="space-y-4">
//         <ProcessStep
//           number={1}
//           title="워크스페이스에서 '새 문서' 클릭"
//           description="워크스페이스 상단의 '+ 새 문서' 버튼을 클릭하세요."
//         />
//         <ProcessStep
//           number={2}
//           title="파일 업로드 또는 드래그 앤 드롭"
//           description="원하는 문서를 선택하거나, 파일을 드래그하여 업로드하세요."
//         />
//         <ProcessStep
//           number={3}
//           title="요약 옵션 선택"
//           description="요약 길이(짧게/중간/길게)와 키워드 중심 요약 여부를 선택하세요."
//         />
//         <ProcessStep
//           number={4}
//           title="요약 생성 대기"
//           description="AI가 문서를 분석하여 요약을 생성합니다 (보통 5초 이내)."
//         />
//         <ProcessStep
//           number={5}
//           title="결과 확인 및 저장"
//           description="3줄 핵심 요약, 구조적 요약, 주요 키워드를 확인하고 저장하세요."
//         />
//       </div>
//
//       {/* 팁 박스 */}
//       <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
//         <div className="flex items-start gap-3">
//           <Lightbulb className="text-blue-500 flex-shrink-0 mt-1" size={20} />
//           <div>
//             <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">
//               💡 Pro Tip
//             </h4>
//             <p className="text-sm text-text-primary-light dark:text-text-primary-dark">
//               문서가 길 경우, '중간' 길이로 먼저 요약을 받아보고,
//               필요하면 '길게' 옵션으로 다시 생성하면 더 효율적입니다.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
//
// // ===== 음성 파일 요약 섹션 =====
// function VoiceSummarizeSection() {
//   return (
//     <div className="space-y-8">
//       <div>
//         <div className="flex items-center gap-3 mb-4">
//           <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
//             <Mic className="text-white" size={24} />
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
//               음성 파일 요약
//             </h2>
//             <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
//               회의 녹음, 강의 녹음을 텍스트로 변환하고 요약하기
//             </p>
//           </div>
//         </div>
//       </div>
//
//       {/* 지원 형식 */}
//       <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
//         <h3 className="font-bold mb-4">지원 오디오 형식</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="p-4 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark">
//             <div className="text-2xl mb-2">🎵</div>
//             <h4 className="font-semibold text-sm mb-1">MP3</h4>
//             <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
//               최대 60분, 일반적인 오디오 형식
//             </p>
//           </div>
//           <div className="p-4 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark">
//             <div className="text-2xl mb-2">🎙️</div>
//             <h4 className="font-semibold text-sm mb-1">WAV</h4>
//             <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
//               최대 60분, 고품질 오디오
//             </p>
//           </div>
//         </div>
//       </div>
//
//       {/* 프로세스 */}
//       <div className="space-y-4">
//         <ProcessStep
//           number={1}
//           title="음성 파일 업로드"
//           description="회의 녹음 또는 강의 녹음 파일을 선택하세요."
//         />
//         <ProcessStep
//           number={2}
//           title="STT 변환"
//           description="AI가 음성을 텍스트로 자동 변환합니다 (Whisper 엔진 사용)."
//         />
//         <ProcessStep
//           number={3}
//           title="자동 요약 생성"
//           description="변환된 텍스트를 기반으로 핵심 내용을 요약합니다."
//         />
//         <ProcessStep
//           number={4}
//           title="회의록 스타일 구조화"
//           description="선택 옵션으로 회의록 형태로 자동 정리할 수 있습니다."
//         />
//       </div>
//
//       {/* 사용 예시 */}
//       <div className="bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 p-6">
//         <h3 className="font-bold mb-4 text-green-700 dark:text-green-400">
//           실제 사용 사례
//         </h3>
//         <div className="space-y-3 text-sm">
//           <div className="flex items-start gap-2">
//             <CheckCircle2 className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
//             <p>
//               <strong>대학생:</strong> 2시간짜리 교수님 강의를 10분 만에 핵심 요약
//             </p>
//           </div>
//           <div className="flex items-start gap-2">
//             <CheckCircle2 className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
//             <p>
//               <strong>직장인:</strong> 주간 회의 녹음을 자동으로 회의록 형태로 변환
//             </p>
//           </div>
//           <div className="flex items-start gap-2">
//             <CheckCircle2 className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
//             <p>
//               <strong>연구자:</strong> 인터뷰 내용을 텍스트화하고 주요 인사이트 추출
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
//
// // ===== 문서 비교 섹션 =====
// function CompareDocsSection() {
//   return (
//     <div className="space-y-8">
//       <div>
//         <div className="flex items-center gap-3 mb-4">
//           <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
//             <GitCompare className="text-white" size={24} />
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
//               문서 비교하기
//             </h2>
//             <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
//               여러 문서의 변화와 흐름을 분석하는 방법
//             </p>
//           </div>
//         </div>
//       </div>
//
//       <p className="text-text-primary-light dark:text-text-primary-dark leading-relaxed">
//         FloCut의 강력한 기능 중 하나는 여러 문서를 비교하여
//         <strong className="text-accent"> 추가/삭제/수정된 내용</strong>을
//         자동으로 분석하는 것입니다.
//       </p>
//
//       {/* 비교 가능한 시나리오 */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="p-4 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
//           <h4 className="font-semibold mb-2">📅 회의록 비교</h4>
//           <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
//             이번 주 vs 지난주 회의에서 무엇이 달라졌는지 추적
//           </p>
//         </div>
//         <div className="p-4 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
//           <h4 className="font-semibold mb-2">📝 문서 버전 비교</h4>
//           <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
//             기획서 초안 vs 최종본에서 어떤 내용이 추가/삭제되었는지
//           </p>
//         </div>
//         <div className="p-4 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
//           <h4 className="font-semibold mb-2">📚 강의 노트 비교</h4>
//           <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
//             1주차 vs 2주차 강의에서 개념이 어떻게 발전했는지
//           </p>
//         </div>
//         <div className="p-4 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
//           <h4 className="font-semibold mb-2">🔄 정책 변경 추적</h4>
//           <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
//             개정 전후 정책 문서의 차이점 한눈에 파악
//           </p>
//         </div>
//       </div>
//
//       {/* 비교 프로세스 */}
//       <div className="space-y-4">
//         <ProcessStep
//           number={1}
//           title="비교할 문서 선택 (2~5개)"
//           description="워크스페이스에서 비교하고 싶은 문서를 선택하세요."
//         />
//         <ProcessStep
//           number={2}
//           title="기준 문서 지정 (선택)"
//           description="어떤 문서를 기준으로 비교할지 선택할 수 있습니다."
//         />
//         <ProcessStep
//           number={3}
//           title="AI 분석 실행"
//           description="문서 간 유사도를 분석하고 변화를 자동으로 도출합니다."
//         />
//         <ProcessStep
//           number={4}
//           title="결과 확인"
//           description="추가/삭제/수정/이동된 내용을 색상별로 확인하세요."
//         />
//       </div>
//
//       {/* 비교 결과 예시 */}
//       <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
//         <h3 className="font-bold mb-4">비교 결과 예시</h3>
//         <div className="space-y-3">
//           <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
//             <span className="text-xs font-semibold text-green-700 dark:text-green-400">
//               추가됨 (Added)
//             </span>
//             <p className="text-sm mt-1">신규 고객 확보 목표 설정</p>
//           </div>
//           <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
//             <span className="text-xs font-semibold text-red-700 dark:text-red-400">
//               삭제됨 (Removed)
//             </span>
//             <p className="text-sm mt-1">오프라인 이벤트 계획</p>
//           </div>
//           <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
//             <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
//               수정됨 (Modified)
//             </span>
//             <p className="text-sm mt-1">매출 목표: 100% → 115%</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
//
// // ===== AI 피드백 섹션 =====
// function AIFeedbackSection() {
//   return (
//     <div className="space-y-8">
//       <div>
//         <div className="flex items-center gap-3 mb-4">
//           <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
//             <MessageSquare className="text-white" size={24} />
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
//               AI 피드백
//             </h2>
//             <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
//               문서 품질을 개선하는 AI 코칭 받기
//             </p>
//           </div>
//         </div>
//       </div>
//
//       <p className="text-text-primary-light dark:text-text-primary-dark leading-relaxed">
//         AI 피드백은 단순 요약을 넘어, 문서의 <strong className="text-accent">논리 구조</strong>,
//         <strong className="text-accent"> 누락된 요소</strong>,
//         <strong className="text-accent"> 개선