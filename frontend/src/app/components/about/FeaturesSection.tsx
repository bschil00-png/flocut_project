"use client";

import { motion } from "framer-motion";
import { FileText, Mic, GitCompare, MessageSquare, ArrowRight } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: FileText,
      title: "문서 요약",
      description: "PDF, DOCX, TXT 문서를 업로드하면 AI가 자동으로 핵심 내용을 3줄 요약과 구조적 문단으로 정리합니다",
      stats: [
        { label: "지원 포맷", value: "10+" },
        { label: "최대 페이지", value: "200" }
      ],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Mic,
      title: "음성 요약",
      description: "회의 녹음 파일을 텍스트로 변환하고 핵심 논의사항을 자동으로 구조화합니다",
      stats: [
        { label: "최대 길이", value: "60분" },
        { label: "정확도", value: "95%" }
      ],
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: GitCompare,
      title: "문서 비교",
      description: "여러 문서의 변경사항을 AI가 분석하여 추가·삭제·수정 내용을 명확하게 표시합니다",
      stats: [
        { label: "동시 비교", value: "5개" },
        { label: "처리 속도", value: "5초" }
      ],
      color: "from-orange-500 to-red-500"
    },
    {
      icon: MessageSquare,
      title: "AI 피드백",
      description: "문서의 논리 구조와 누락된 요소를 분석하여 개선 방향을 실시간으로 제안합니다",
      stats: [
        { label: "분석 항목", value: "10+" },
        { label: "응답 시간", value: "즉시" }
      ],
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <section className="w-full py-24 bg-slate-50 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            핵심 기능
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            문서 처리의 모든 단계를 AI가 자동화합니다
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:border-accent/50 transition-all hover:shadow-xl"
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity`} />

                <div className="relative">
                  <div className={`inline-flex w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                  </div>

                  <h3 className="text-2xl font-bold mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="flex items-center gap-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                    {feature.stats.map((stat, idx) => (
                      <div key={idx}>
                        <div className="text-2xl font-bold text-accent">{stat.value}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  <button className="mt-6 flex items-center gap-2 text-accent font-medium text-sm group-hover:gap-3 transition-all">
                    자세히 보기
                    <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}