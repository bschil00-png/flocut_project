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
      {/* Header - 아래에서 위로 올라오는 애니메이션 적용 */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-text-primary-light dark:text-text-primary-dark">
          우리 팀
        </h2>
        <p className="text-lg text-text-muted-light dark:text-text-muted-dark font-medium">
          열정과 전문성을 갖춘 FLOCUT 팀을 소개합니다
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
        {team.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="group bg-surface-light dark:bg-surface-dark rounded-2xl p-8 border border-border-light dark:border-border-dark hover:border-accent/40 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/5 hover:-translate-y-1"
          >
            <div className="relative mb-6">
              {/* 프로필 이미지 박스 - 공용 border 및 그림자 적용 */}
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {member.initial}
              </div>
            </div>

            <h3 className="text-xl font-bold text-center mb-1 text-text-primary-light dark:text-text-primary-dark">
              {member.name}
            </h3>
            <p className="text-sm text-accent font-bold text-center mb-4 uppercase tracking-wide">
              {member.role}
            </p>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark leading-relaxed mb-6 text-center font-medium">
              {member.description}
            </p>

            {/* Skills - 공용 surface 및 text 컬러 적용 */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {member.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-[11px] font-bold rounded-full bg-background-light dark:bg-surface-hover text-text-muted-light dark:text-text-muted-dark border border-border-light dark:border-border-dark uppercase tracking-wider"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Social links - 공용 surface 및 border 컬러 적용 */}
            <div className="flex items-center justify-center gap-3 pt-6 border-t border-border-light dark:border-border-dark">
              {[Github, Mail].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-xl bg-background-light dark:bg-surface-hover flex items-center justify-center text-text-muted-light dark:text-text-muted-dark border border-border-light dark:border-border-dark hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 shadow-sm"
                >
                  <Icon size={16} strokeWidth={2} />
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}