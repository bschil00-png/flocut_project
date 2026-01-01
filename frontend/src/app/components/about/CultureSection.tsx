"use client";

import { motion } from "framer-motion";
import { Sparkles, Users, Target, TrendingUp, Heart, Lightbulb } from "lucide-react";

export default function CultureSection() {
  const values = [
    {
      icon: Sparkles,
      title: "혁신",
      description: "끊임없는 기술 혁신으로 사용자 경험을 개선합니다",
      color: "text-yellow-500"
    },
    {
      icon: Users,
      title: "협업",
      description: "팀워크와 열린 소통을 통해 최고의 결과를 만듭니다",
      color: "text-blue-500"
    },
    {
      icon: Target,
      title: "사용자 중심",
      description: "사용자의 실제 니즈를 파악하고 해결합니다",
      color: "text-green-500"
    },
    {
      icon: TrendingUp,
      title: "성장",
      description: "함께 배우고 성장하는 문화를 만들어갑니다",
      color: "text-purple-500"
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold mb-4">
          우리의 가치와 문화
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          FloCut 프로젝트가 추구하는 핵심 가치
        </p>
      </motion.div>

      {/* Core Values */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {values.map((value, index) => {
          const Icon = value.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:border-accent/50 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center ${value.color} group-hover:scale-110 transition-transform`}>
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    {value.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Working Principles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-700"
      >
        <h3 className="text-xl font-bold mb-6 text-center">
          우리의 일하는 방식
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {principles.map((principle, index) => {
            const Icon = principle.icon;
            return (
              <div key={index} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                  <Icon size={20} />
                </div>
                <div>
                  <div className="font-semibold mb-1">{principle.title}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{principle.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}