"use client";

import { motion } from "framer-motion";
import { FileText, Mic, GitCompare, MessageSquare, ArrowRight } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: FileText,
      title: "문서 요약",
      description: "PDF, DOCX, TXT 문서를 업로드하면 AI가 자동으로 핵심 내용을 구조화된 리포트로 정제합니다.",
      stats: [
        { label: "지원 포맷", value: "10+" },
        { label: "최대 페이지", value: "200" }
      ],
    },
    {
      icon: Mic,
      title: "음성 요약",
      description: "회의 및 대화 녹음 파일을 분석하여 핵심 논의사항과 의사결정 포인트를 자동 추출합니다.",
      stats: [
        { label: "최대 길이", value: "60분" },
        { label: "정확도", value: "95%" }
      ],
    },
    {
      icon: GitCompare,
      title: "문서 비교",
      description: "여러 버전의 문서를 대조하여 변경사항과 공통점을 AI가 다각도로 분석해 드립니다.",
      stats: [
        // { label: "동시 비교", value: "5개" },
        { label: "처리 속도", value: "30초" }
      ],
    },
    {
      icon: MessageSquare,
      title: "AI 피드백",
      description: "문서의 논리 전개와 정보의 완결성을 검토하여 실시간으로 보완 가이드를 제공합니다.",
      stats: [
        { label: "분석 항목", value: "10+" },
        { label: "응답 시간", value: "즉시" }
      ],
    },
  ];

  return (
    <section className="w-full py-28 bg-background-light dark:bg-background-dark transition-colors">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header - 아래에서 위로 올라오는 애니메이션 적용 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight text-text-primary-light dark:text-text-primary-dark">
            핵심 기능
          </h2>
          <p className="text-lg text-text-muted-light dark:text-text-muted-dark max-w-2xl mx-auto font-medium">
            FLOCUT의 지능형 AI가 문서 처리의 모든 과정을 정교하게 자동화합니다.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group relative bg-surface-light dark:bg-surface-dark rounded-2xl p-8 border border-border-light dark:border-border-dark transition-all duration-300 hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/5 hover:-translate-y-1"
              >
                <div className="relative">
                  {/* Icon Box - 공용 accent 컬러 및 테마 적용 */}
                  <div className="inline-flex w-14 h-14 rounded-2xl bg-background-light dark:bg-surface-hover items-center justify-center text-accent mb-6 border border-border-light dark:border-border-dark group-hover:bg-accent group-hover:text-white transition-all duration-300 shadow-sm">
                    <Icon size={24} strokeWidth={1.5} />
                  </div>

                  <h3 className="text-2xl font-bold mb-3 text-text-primary-light dark:text-text-primary-dark group-hover:text-accent transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-text-muted-light dark:text-text-muted-dark mb-8 leading-relaxed font-medium">
                    {feature.description}
                  </p>

                  {/* Stats - 공용 border 및 text-accent 적용 */}
                  <div className="flex items-center gap-8 pt-6 border-t border-border-light dark:border-border-dark">
                    {feature.stats.map((stat, idx) => (
                      <div key={idx}>
                        <div className="text-2xl font-bold text-accent">{stat.value}</div>
                        <div className="text-[10px] font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Action Button - 경로 등 유지 */}
                  <button className="mt-8 flex items-center gap-2 text-accent font-bold text-sm group-hover:gap-3 transition-all hover:underline">
                    {/*상세 정보 확인*/}
                    {/*<ArrowRight size={16} strokeWidth={2.5} />*/}
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