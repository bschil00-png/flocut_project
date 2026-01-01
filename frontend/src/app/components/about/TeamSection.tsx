"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

export default function TeamSection() {
  const team = [
    {
      name: "변철환",
      role: "팀장 / Backend Developer",
      description: "프로젝트 총괄 및 백엔드 아키텍처 설계를 담당합니다. Spring Boot와 PostgreSQL을 활용한 안정적인 시스템을 구축합니다.",
      initial: "F",
      gradient: "from-blue-600 to-blue-400",
      skills: ["Spring Boot", "PostgreSQL", "AWS"]
    },
    {
      name: "정사랑",
      role: "Frontend Developer",
      description: "UI/UX 설계 및 프론트엔드 개발을 담당합니다. Next.js로 사용자 친화적인 인터페이스를 구현합니다.",
      initial: "S",
      gradient: "from-purple-600 to-purple-400",
      skills: ["Next.js", "TypeScript", "Tailwind"]
    },
    {
      name: "황명수",
      role: "AI Engineer",
      description: "AI 모델 설계 및 최적화를 담당합니다. LangChain과 GPT를 활용한 문서 분석 시스템을 개발합니다.",
      initial: "M",
      gradient: "from-green-600 to-green-400",
      skills: ["LangChain", "GPT-4", "Python"]
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
          우리 팀
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          열정과 전문성을 갖춘 FloCut 팀을 소개합니다
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {team.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:border-accent/50 transition-all hover:shadow-xl"
          >
            <div className="relative mb-6">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-lg group-hover:scale-110 transition-transform`}>
                {member.initial}
              </div>
            </div>

            <h3 className="text-xl font-bold text-center mb-1">
              {member.name}
            </h3>
            <p className="text-sm text-accent font-medium text-center mb-4">
              {member.role}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              {member.description}
            </p>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {member.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Social links */}
            <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-accent hover:text-white transition-all">
                <Github size={16} />
              </button>
              <button className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-accent hover:text-white transition-all">
                <Linkedin size={16} />
              </button>
              <button className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-accent hover:text-white transition-all">
                <Mail size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}