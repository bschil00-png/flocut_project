"use client";

import { motion } from "framer-motion";
import { Sparkles, Users, Target, TrendingUp, Heart, Lightbulb } from "lucide-react";

export default function CultureSection() {
  const values = [
    {
      icon: Sparkles,
      title: "혁신",
      description: "끊임없는 기술 혁신으로 사용자 경험을 개선합니다",
      color: "text-accent" // 테마 컬러로 통일
    },
    {
      icon: Users,
      title: "협업",
      description: "팀워크와 열린 소통을 통해 최고의 결과를 만듭니다",
      color: "text-accent"
    },
    {
      icon: Target,
      title: "사용자 중심",
      description: "사용자의 실제 니즈를 파악하고 해결합니다",
      color: "text-accent"
    },
    {
      icon: TrendingUp,
      title: "성장",
      description: "함께 배우고 성장하는 문화를 만들어갑니다",
      color: "text-accent"
    }
  ];

  const principles = [
    {
      icon: Heart,
      title: "사용자 경험 우선",
      desc: "모든 결정의 중심에는 사용자가 있습니다"
    },
    {
      icon: Lightbulb,
      title: "빠른 실험과 학습",
      desc: "실패를 두려워하지 않고 지속적으로 개선합니다"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header - 아래에서 위로 올라오는 애니메이션 적용 */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-text-primary-light dark:text-text-primary-dark">
          우리의 가치와 문화
        </h2>
        <p className="text-lg text-text-muted-light dark:text-text-muted-dark font-medium">
          FLOCUT 프로젝트가 추구하는 핵심 가치
        </p>
      </motion.div>

      {/* Core Values Grid - 공용 surface 및 border 컬러 적용 */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {values.map((value, index) => {
          const Icon = value.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group bg-surface-light dark:bg-surface-dark rounded-2xl p-8 border border-border-light dark:border-border-dark hover:border-accent/40 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/5"
            >
              <div className="flex items-start gap-5">
                {/* 아이콘 박스 - 공용 테마 적용 */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-background-light dark:bg-surface-hover border border-border-light dark:border-border-dark flex items-center justify-center ${value.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-text-primary-light dark:text-text-primary-dark group-hover:text-accent transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-sm text-text-muted-light dark:text-text-muted-dark leading-relaxed font-medium">
                    {value.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Working Principles - 공용 surface 및 border 컬러 적용 */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="bg-surface-light dark:bg-surface-dark rounded-2xl p-8 lg:p-10 border border-border-light dark:border-border-dark shadow-sm"
      >
        <h3 className="text-xs font-bold mb-8 text-center text-accent uppercase tracking-[0.2em]">
          우리의 일하는 방식
        </h3>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {principles.map((principle, index) => {
            const Icon = principle.icon;
            return (
              <div key={index} className="flex items-start gap-5 group">
                <div className="w-10 h-10 rounded-xl bg-background-light dark:bg-surface-hover border border-border-light dark:border-border-dark flex items-center justify-center text-accent flex-shrink-0 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                  <Icon size={20} strokeWidth={2} />
                </div>
                <div>
                  <div className="font-bold text-text-primary-light dark:text-text-primary-dark mb-1 tracking-tight">
                    {principle.title}
                  </div>
                  <div className="text-sm text-text-muted-light dark:text-text-muted-dark font-medium leading-relaxed">
                    {principle.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}