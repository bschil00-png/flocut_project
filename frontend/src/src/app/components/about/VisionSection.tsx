"use client";

import { motion } from "framer-motion";
import { Target, Cpu, Layers, ChevronRight } from "lucide-react";

export default function VisionSection() {
  const goals = [
    {
      icon: Target,
      title: "핵심 목표",
      items: [
        "문서·음성 자동 요약 시스템 구현",
        "다중 문서 비교 분석 기능 제공",
        "AI 기반 문서 코칭 기능 개발"
      ]
    },
    {
      icon: Cpu,
      title: "기술적 목표",
      items: [
        "LangChain 기반 문서 처리 파이프라인 구축",
        "벡터 검색을 활용한 의미 기반 비교",
        "확장 가능한 백엔드 아키텍처 설계"
      ]
    },
    {
      icon: Layers,
      title: "장기 확장",
      items: [
        "대용량 문서 처리 시스템 구축",
        "팀 협업 및 문서 공유 기능",
        "회의 기록 자동 구조화 기능"
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header - 아래에서 위로 올라오는 애니메이션 적용 */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-text-primary-light dark:text-text-primary-dark tracking-tight">
          우리의 비전
        </h2>
        <div className="max-w-3xl mx-auto">
          {/* FLOCUT 대문자 표기 및 공용 text 컬러 적용 */}
          <p className="text-lg text-text-muted-light dark:text-text-muted-dark leading-relaxed mb-6 font-medium">
            FLOCUT은 정보 과부하 시대에 사용자가 더 효율적으로 학습하고 이해할 수 있도록 돕는{" "}
            <span className="text-accent font-bold underline underline-offset-4 decoration-accent/30">지능형 문서 보조 플랫폼</span>을 구축합니다.
          </p>
          <p className="text-text-muted-light dark:text-text-muted-dark font-medium">
            단순한 요약을 넘어 문서 이해·비교·재구성의 전 과정을 AI가 지원합니다.
          </p>
        </div>
      </motion.div>

      {/* Goals Grid -  */}
      <div className="grid md:grid-cols-3 gap-8">
        {goals.map((goal, index) => {
          const Icon = goal.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-surface-light dark:bg-surface-dark rounded-2xl p-8 border border-border-light dark:border-border-dark hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/5 transition-all duration-300"
            >
              {/* 아이콘 박스 */}
              <div className="w-12 h-12 rounded-xl bg-background-light dark:bg-surface-hover flex items-center justify-center text-accent mb-6 border border-border-light dark:border-border-dark shadow-sm">
                <Icon size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold mb-6 text-text-primary-light dark:text-text-primary-dark">
                {goal.title}
              </h3>
              <ul className="space-y-4">
                {goal.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <ChevronRight size={16} className="text-accent mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                    <span className="text-text-muted-light dark:text-text-muted-dark font-medium leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom highlight - 공용 border 및 dashed 테마 적용 */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-16 p-10 rounded-2xl bg-surface-light dark:bg-surface-dark border border-dashed border-border-light dark:border-border-dark transition-colors"
      >
        <div className="text-center">
          <div className="text-accent font-bold mb-3 uppercase tracking-[0.2em] text-xs">핵심 가치</div>
          <div className="text-2xl md:text-3xl font-bold mb-6 text-text-primary-light dark:text-text-primary-dark tracking-tight">
            기록 → 이해 → 피드백 → 비교 → 재구성
          </div>
          <p className="text-text-muted-light dark:text-text-muted-dark font-bold text-sm uppercase tracking-widest">
            문서 처리의 전체 사이클을 하나의 플랫폼에서 완성합니다
          </p>
        </div>
      </motion.div>
    </div>
  );
}