"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative w-full pt-32 pb-20 bg-gradient-to-b from-background-light to-surface-light dark:from-background-dark dark:to-surface-dark overflow-hidden">
      {/* Animated gradient background - 기존 레이아웃 유지 */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left - Content (Bottom to Top Animation 수정) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Badge - 공용 accent 컬러 사용 */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
              <Sparkles size={14} className="animate-pulse" />
              AI-Powered Content Intelligence
            </div>

            {/* 메인 카피 - 공용 text 컬러 사용 */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight text-text-primary-light dark:text-text-primary-dark">
                <span className="bg-gradient-to-r from-text-primary-light to-text-primary-light/70 dark:from-text-primary-dark dark:to-text-primary-dark/70 bg-clip-text text-transparent">
                문서의 흐름을
                <br />
                한눈에 파악하세요
            </span>
            </h1>

            {/* 서브 카피 - 문구 정제 및 공용 text-muted 컬러 사용 */}
            <p className="text-xl text-text-muted-light dark:text-text-muted-dark mb-8 leading-relaxed max-w-xl font-medium">
              FLOCUT은 방대한 문서와 음성 데이터를 정교하게 분석하여
              가장 핵심적인 정보만을 고도로 정제된 요약본으로 재구성합니다.
              복잡한 자료 처리는 이제 AI에게 맡기고 본질에만 집중하세요.
            </p>

            {/* CTA Buttons - 워크스페이스 경로 및 서비스 소개 연결 */}
            <div className="flex flex-wrap items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/workspace")}
                className="group relative h-12 px-6 rounded-lg bg-accent hover:bg-accent-hover text-white font-semibold text-base shadow-lg shadow-accent/25 transition-all overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                    무료로 시작하기
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </motion.button>

              <button
                onClick={() => router.push("/about")}
                className="h-12 px-6 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark hover:bg-surface-light dark:hover:bg-surface-dark font-medium transition-colors flex items-center gap-2"
              >
                <Play size={16} />
                서비스 소개
              </button>
            </div>

            {/* Stats - 공용 accent 컬러 적용 */}
            <div className="flex items-center gap-8 mt-10 pt-8 border-t border-border-light dark:border-border-dark">
              <div>
                <div className="text-2xl font-bold text-accent">30초</div>
                <div className="text-sm text-text-muted-light dark:text-text-muted-dark font-medium">평균 처리 시간</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">95%+</div>
                <div className="text-sm text-text-muted-light dark:text-text-muted-dark font-medium">요약 정확도</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">3+</div>
                <div className="text-sm text-text-muted-light dark:text-text-muted-dark font-medium">지원 포맷</div>
              </div>
            </div>
          </motion.div>

          {/* Right - Visual Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* 카드 배경 및 보더 - 공용 컬러 규격 적용 */}
            <div className="relative rounded-2xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-8 shadow-2xl overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark">
                  <span className="text-sm font-bold">AI 요약 리포트</span>
                  <span className="text-xs font-bold text-accent">전문화된 요약 구성중</span>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "텍스트 구조화", val: "최적화 완료", color: "text-accent" },
                    { label: "핵심 키워드 추출", val: "12개 선정", color: "text-green-500" },
                    { label: "문맥 유지 품질", val: "매우 높음", color: "text-blue-500" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark shadow-sm">
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className={`text-sm font-bold ${item.color}`}>{item.val}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-border-light dark:border-border-dark">
                  <div className="text-xs text-text-muted-light dark:text-text-muted-dark font-bold mb-2 uppercase tracking-tight">분석 및 요약 진행률</div>
                  <div className="h-2 bg-background-light dark:bg-background-dark rounded-full overflow-hidden border border-border-light dark:border-border-dark">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "95%" }}
                      transition={{ duration: 2.5, delay: 0.5 }}
                      className="h-full bg-accent rounded-full"
                    />
                  </div>
                </div>
              </div>

              {/* Floating elements 배경 장식 */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}