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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold mb-6">
          우리의 비전
        </h2>
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
            FloCut은 정보 과부하 시대에 사용자가 더 효율적으로 학습하고 이해할 수 있도록 돕는{" "}
            <span className="text-accent font-semibold">지능형 문서 보조 플랫폼</span>을 구축합니다.
          </p>
          <p className="text-slate-600 dark:text-slate-400">
            단순한 요약을 넘어 문서 이해·비교·재구성의 전 과정을 AI가 지원합니다.
          </p>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {goals.map((goal, index) => {
          const Icon = goal.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:border-accent/50 transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-6">
                <Icon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-6">
                {goal.title}
              </h3>
              <ul className="space-y-3">
                {goal.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <ChevronRight size={16} className="text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom highlight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5 border border-accent/20"
      >
        <div className="text-center">
          <div className="text-accent font-semibold mb-2">핵심 가치</div>
          <div className="text-2xl font-bold mb-4">
            기록 → 이해 → 피드백 → 비교 → 재구성
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            문서 처리의 전체 사이클을 하나의 플랫폼에서 완성합니다
          </p>
        </div>
      </motion.div>
    </div>
  );
}