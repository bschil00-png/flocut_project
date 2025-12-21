"use client"

import {
  Sparkles,
  Users,
  Target,
  Zap,
  FileText,
  Mic,
  GitCompare,
  MessageSquare,
  ChevronRight,
  Heart,
  Globe,
} from "lucide-react";
import {useState} from "react";

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("vision");

  const features = [
    {
      icon: <FileText size={24} />,
      title: "문서 요약",
      description: "PDF, DOCX 문서를 즉시 분석하고 핵심만 추출합니다",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Mic size={24} />,
      title: "음성 요약",
      description: "회의 녹음을 자동으로 텍스트화하고 구조화합니다",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <GitCompare size={24} />,
      title: "문서 비교",
      description: "여러 버전의 문서 변경사항을 AI가 분석합니다",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: <MessageSquare size={24} />,
      title: "AI 피드백",
      description: "문서 품질과 구조를 분석하여 개선점을 제안합니다",
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  const techStack = [
    { label: "AI 모델", value: "GPT-4", icon: <Sparkles size={20} /> },
    { label: "음성 처리", value: "Whisper", icon: <Mic size={20} /> },
    { label: "문서 분석", value: "LangChain", icon: <FileText size={20} /> },
    { label: "벡터 검색", value: "pgvector", icon: <Zap size={20} /> },
  ];

  const team = [
    {
      name: "변철환",
      role: "팀장 / Backend Developer",
      description: "프로젝트 총괄 및 백엔드 아키텍처 설계",
      image: "F",
      color: "bg-blue-600",
    },
    {
      name: "정사랑",
      role: "Frontend Developer",
      description: "UI/UX 설계 및 프론트엔드 개발",
      image: "S",
      color: "bg-blue-500",
    },
    {
      name: "황명수",
      role: "AI Engineer",
      description: "AI 모델 설계 및 최적화",
      image: "M",
      color: "bg-blue-500",
    },
  ];

  const values = [
    {
      icon: <Sparkles size={24} />,
      title: "혁신",
      description: "끊임없는 기술 혁신으로 사용자 경험을 개선합니다",
    },
    {
      icon: <Users size={24} />,
      title: "협업",
      description: "팀워크와 열린 소통을 통해 최고의 결과를 만듭니다",
    },
    {
      icon: <Target size={24} />,
      title: "사용자 중심",
      description: "사용자의 실제 니즈를 파악하고 해결합니다",
    },
    {
      icon: <Globe size={24} />,
      title: "성장",
      description: "함께 배우고 성장하는 문화를 만들어갑니다",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-blue-500/5" />
        <div className="relative max-w-7xl mx-auto px-8 py-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <Sparkles size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-600">About FloCut</span>
            </div>
            <h1 className="text-6xl font-bold text-slate-900 dark:text-white mb-6">
              문서 이해의
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-500">
                새로운 패러다임
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              FloCut은 AI 기반 문서 분석 기술로 여러분의 업무와 학습 효율을 높입니다.
              <br />
              요약, 비교, 피드백까지 하나의 플랫폼에서 제공합니다.
            </p>
          </div>

          {/* Tech Stack */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 text-blue-600 mx-auto mb-3">
                  {tech.icon}
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {tech.value}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {tech.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="max-w-7xl mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            핵심 기능
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            FloCut이 제공하는 강력한 AI 기반 문서 처리 기능
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all hover:shadow-lg"
            >
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}
              >
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Vision / Team / Culture Tabs */}
      <section className="border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-8 py-24">
          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-12">
            {[
              { id: "vision", label: "비전", icon: <Target size={18} /> },
              { id: "team", label: "팀", icon: <Users size={18} /> },
              { id: "culture", label: "문화", icon: <Heart size={18} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Vision Content */}
          {activeTab === "vision" && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
                  우리의 비전
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  FloCut은 정보 과부하 시대에 사용자가 더 효율적으로 학습하고 이해할 수 있도록 돕는
                  <br />
                  <span className="text-blue-600 font-semibold">지능형 문서 보조 플랫폼</span>을 구축하는 것을 목표로 합니다.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "핵심 목표",
                    items: [
                      "문서·음성 자동 요약 시스템 구현",
                      "다중 문서 비교 분석 기능 제공",
                      "AI 기반 문서 코칭 기능 개발",
                    ],
                  },
                  {
                    title: "기술적 목표",
                    items: [
                      "LangChain 기반 문서 처리 파이프라인 구축",
                      "벡터 검색을 활용한 의미 기반 비교",
                      "확장 가능한 백엔드 아키텍처 설계",
                    ],
                  },
                ].map((goal, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  >
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                      {goal.title}
                    </h3>
                    <ul className="space-y-3">
                      {goal.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <ChevronRight size={16} className="text-blue-600 mt-1 flex-shrink-0" />
                          <span className="text-slate-900 dark:text-white">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team Content */}
          {activeTab === "team" && (
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
                  우리 팀
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  열정과 전문성을 갖춘 FloCut 팀을 소개합니다
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {team.map((member, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all text-center group"
                  >
                    <div
                      className={`w-20 h-20 rounded-full ${member.color} flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform`}
                    >
                      {member.image}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                      {member.name}
                    </h3>
                    <p className="text-sm text-blue-600 font-medium mb-3">
                      {member.role}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {member.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Culture Content */}
          {activeTab === "culture" && (
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
                  우리의 가치와 접근
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  FloCut 프로젝트가 추구하는 핵심 가치
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 flex-shrink-0">
                        {value.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                          {value.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-8 py-24">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-purple-500 p-12 text-center">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-4">
              FloCut 프로젝트 알아보기
            </h2>
            <p className="text-lg text-white/90 mb-8">
              프로젝트의 진행 상황과 최신 기능을 확인해보세요
            </p>
            <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
              시작하기
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      </section>
    </div>
  );
}