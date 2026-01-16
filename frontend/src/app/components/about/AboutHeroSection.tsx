"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, CheckCircle } from "lucide-react";

export default function AboutHeroSection() {
  const highlights = [
    "문서·음성 통합 분석",
    "실시간 AI 피드백",
    "다중 문서 비교"
  ];

  return (
    <section className="relative w-full pt-32 pb-32 overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-accent text-sm font-medium mb-6 shadow-sm">
              <Sparkles size={16} />
              <span>AI-Powered Document Platform</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold leading-[1.2] mb-6">
              문서 업무의
              <br />
              {/* 수정 포인트: inline-block과 pb-1을 추가하여 그라데이션이 짤리지 않게 공간 확보 */}
              <span className="inline-block pb-1 bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
                모든 과정을 자동화
              </span>
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              FloCut은 문서 요약부터 비교 분석, AI 코칭까지
              <br className="hidden md:block" />
              문서 처리의 전 과정을 하나의 플랫폼에서 완성합니다.
            </p>

            {/* Highlights */}
            <div className="flex flex-wrap gap-4 mb-8">
              {highlights.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                  <CheckCircle size={16} className="text-accent" />
                  <span className="text-sm font-medium">{item}</span>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group h-14 px-8 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold shadow-lg shadow-accent/30 transition-all inline-flex items-center gap-2"
            >
              자세히 알아보기
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

          {/* Right - Visual Card (동일) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative">
              <div className="relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-sm font-semibold">문서 분석 현황</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                      처리중
                    </span>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: "요약 완료", value: "95%", color: "bg-blue-500" },
                      { label: "키워드 추출", value: "100%", color: "bg-green-500" },
                      { label: "비교 분석", value: "87%", color: "bg-purple-500" },
                      { label: "AI 피드백", value: "92%", color: "bg-orange-500" }
                    ].map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                          <span className="font-semibold text-accent">{item.value}</span>
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: item.value }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                            className={`h-full ${item.color} rounded-full`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute -top-4 -right-4 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg"
              >
                <div className="text-2xl font-bold text-accent">2,500+</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">활성 사용자</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="absolute -bottom-4 -left-4 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg"
              >
                <div className="text-2xl font-bold text-accent">5초</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">평균 처리 시간</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}