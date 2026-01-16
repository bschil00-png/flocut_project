"use client";

import { motion } from "framer-motion";
import { Sparkles, Mic, FileText, Zap, Database, Cloud } from "lucide-react";

export default function TechStackSection() {
  const categories = [
    {
      title: "AI & Processing",
      techs: [
        { label: "GPT-4", desc: "고도화된 텍스트 이해", icon: Sparkles },
        { label: "Whisper", desc: "정확한 음성 인식", icon: Mic },
        { label: "LangChain", desc: "유연한 AI 파이프라인", icon: FileText }
      ]
    },
    {
      title: "Infrastructure",
      techs: [
        { label: "pgvector", desc: "고속 벡터 검색", icon: Zap },
        { label: "PostgreSQL", desc: "안정적인 데이터 관리", icon: Database },
        { label: "AWS", desc: "확장 가능한 인프라", icon: Cloud }
      ]
    }
  ];

  return (
    <section className="w-full py-24 bg-white dark:bg-slate-800">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            검증된 기술 스택
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            최신 AI 기술과 안정적인 인프라로 구축된 플랫폼
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {categories.map((category, catIndex) => (
            <motion.div
              key={catIndex}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: catIndex * 0.1 }}
              className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-700"
            >
              <h3 className="text-xl font-bold mb-6 text-accent">
                {category.title}
              </h3>
              <div className="space-y-4">
                {category.techs.map((tech, techIndex) => {
                  const Icon = tech.icon;
                  return (
                    <motion.div
                      key={techIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: catIndex * 0.1 + techIndex * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-accent/50 transition-all group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent flex-shrink-0 group-hover:bg-accent group-hover:text-white transition-all">
                        <Icon size={20} />
                      </div>
                      <div>
                        <div className="font-semibold mb-1">{tech.label}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">{tech.desc}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}