"use client";

import { motion } from "framer-motion";
import { FileText, Sparkles, GitCompare, MessageSquare, ArrowRight } from "lucide-react";

export default function FlowExplainSection() {
  const steps = [
    {
      icon: FileText,
      title: "데이터 업로드",
      description: "DOCX, TXT 등 문서부터 음성(MP3, WAV) 파일까지 통합 분석 기반을 마련합니다.",
    },
    {
      icon: Sparkles,
      title: "지능형 핵심 추출",
      description: "최신 LLM 모델이 문맥을 이해하여 핵심 요약과 구조화된 인사이트를 도출합니다.",
    },
    {
      icon: GitCompare,
      title: "다차원 변화 비교",
      description: "버전별 변경 사항과 문서 간 공통점·차이점을 자동 분석하여 흐름을 추적합니다.",
    },
    {
      icon: MessageSquare,
      title: "정밀 피드백",
      description: "논리 구조와 정보의 완결성을 검토하여 완성도를 높이기 위한 제안을 제공합니다.",
    }
  ];

  return (
    <section className="w-full py-28 bg-background-light dark:bg-background-dark relative transition-colors">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-text-primary-light dark:text-text-primary-dark">
            분석 프로세스
          </h2>
          <p className="text-lg text-text-muted-light dark:text-text-muted-dark max-w-2xl mx-auto">
            효율적인 문서 관리를 위한 데이터 수집부터 최종 피드백까지의 정교한 과정
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative">
          {/* 연결선 - 공용 border 컬러 적용 */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-[1px] bg-border-light dark:bg-border-dark -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <div className="h-full p-8 rounded-2xl bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark transition-all duration-300 hover:shadow-2xl hover:shadow-accent/5 hover:-translate-y-1">

                    {/* Step number - 공용 accent 컬러 적용 */}
                    <span className="block text-xs font-bold text-accent mb-4 tracking-widest uppercase">
                        Step 0{index + 1}
                    </span>

                    {/* Icon - 공용 surface-light 및 surface-hover 테마 적용 */}
                    <div className="w-12 h-12 rounded-lg bg-surface-light dark:bg-surface-hover flex items-center justify-center text-text-primary-light dark:text-text-primary-dark mb-6 border border-border-light dark:border-border-dark">
                      <Icon size={22} strokeWidth={1.5} />
                    </div>

                    {/* Content - 공용 text 컬러 적용 */}
                    <h3 className="text-lg font-bold mb-3 text-text-primary-light dark:text-text-primary-dark">
                      {step.title}
                    </h3>

                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark leading-relaxed">
                      {step.description}
                    </p>

                    {/* Arrow indicator - 공용 border 및 surface 컬러 적용 */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:flex absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 rounded-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark items-center justify-center z-20">
                        <ArrowRight size={14} className="text-text-muted-light" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom info - 공용 border 및 text 컬러 적용 */}
        <div className="mt-20 pt-8 border-t border-border-light dark:border-border-dark">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-xs font-medium uppercase tracking-widest text-text-muted-light dark:text-text-muted-dark">
            <div className="flex items-center gap-3">
              <span className="w-1 h-1 rounded-full bg-accent" />
              <span>Average 30sec processing</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-1 h-1 rounded-full bg-accent" />
              <span>Up to 200 pages supported</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-1 h-1 rounded-full bg-accent" />
              <span>Enterprise-grade security</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}