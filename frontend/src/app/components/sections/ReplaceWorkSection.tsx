"use client";

import { motion } from "framer-motion";
import { Check, TrendingUp, Users, FileCheck, Share2 } from "lucide-react";

export default function ReplaceWorkSection() {
  const useCases = [
    {
      icon: FileCheck,
      title: "문서 변경점 자동 추적",
      description: "회차별 문서 버전 간의 차이를 정밀하게 비교하여 변경 이력을 시각화하고 흐름을 파악합니다."
    },
    {
      icon: TrendingUp,
      title: "논의 흐름 분석",
      description: "반복되는 회의록을 비교 분석하여 핵심 의사결정 과정과 논의의 변화를 한눈에 확인합니다."
    },
    {
      icon: Check,
      title: "논점 누락 및 완결성 검토",
      description: "AI가 문서의 논리 구조를 심층 분석하여 누락된 필수 항목을 감지하고 보완 방향을 제시합니다."
    },
    {
      icon: Share2,
      title: "협업 최적화 데이터 생성",
      description: "복잡한 분석 결과를 팀원들과 즉시 공유 가능한 수준의 구조화된 리포트로 자동 변환합니다."
    }
  ];

  return (
    <section className="w-full py-28 bg-background-light dark:bg-background-dark relative overflow-hidden transition-colors">
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="max-w-3xl mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight text-text-primary-light dark:text-text-primary-dark">
            단순 반복 업무를 넘어
            <br />
            <span className="text-accent">본질에 집중하는 시간</span>
          </h2>

          <p className="text-lg text-text-muted-light dark:text-text-muted-dark leading-relaxed font-medium">
            기획서, 보고서, 회의록 등 방대한 양의 문서를 반복해서 검토해야 하는 상황에서
            FLOCUT은 데이터 사이의 연결고리를 찾아내어 명확한 인사이트를 제공합니다.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <div key={index} className="group relative">
                <div className="h-full p-8 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark transition-all duration-300 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5">
                  <div className="flex items-start gap-6">
                    {/* 미니멀한 아이콘 박스 - 공용 surface-hover 및 border 컬러 적용 */}
                    <div className="w-12 h-12 rounded-xl bg-background-light dark:bg-surface-hover border border-border-light dark:border-border-dark flex items-center justify-center text-accent flex-shrink-0 transition-transform duration-300 group-hover:-translate-y-1">
                      <Icon size={22} strokeWidth={1.5} />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-3 text-text-primary-light dark:text-text-primary-dark transition-colors group-hover:text-accent">
                        {useCase.title}
                      </h3>
                      <p className="text-sm text-text-muted-light dark:text-text-muted-dark leading-relaxed font-medium">
                        {useCase.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Bar - 공용 border 및 text 컬러 적용 */}
        <div className="mt-20 pt-12 border-t border-border-light dark:border-border-dark">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { value: "2,500+", label: "분석된 문서량" },
              { value: "15,000+", label: "추출된 인사이트" },
              { value: "98%", label: "실무 활용 만족도" }
            ].map((stat, index) => (
              <div key={index} className="flex flex-col items-center md:items-start">
                <div className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-1">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-accent uppercase tracking-[0.2em]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}