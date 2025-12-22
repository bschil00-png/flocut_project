"use client";
import { useState } from "react";
import {
  Search,
  ChevronDown,
  Mail,
  MessageSquare,
  FileText,
  Settings,
  CreditCard,
  Shield,
  Send,
  CheckCircle,
} from "lucide-react";

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = [
    { id: "all", label: "전체", icon: <FileText size={18} /> },
    { id: "general", label: "일반", icon: <MessageSquare size={18} /> },
    { id: "features", label: "기능", icon: <Settings size={18} /> },
    { id: "billing", label: "결제", icon: <CreditCard size={18} /> },
    { id: "security", label: "보안", icon: <Shield size={18} /> },
  ];

  const faqs = [
    {
      id: 1,
      category: "general",
      question: "FloCut은 어떤 서비스인가요?",
      answer: "FloCut은 AI 기반 문서 및 음성 요약 플랫폼입니다. PDF, DOCX 문서를 업로드하거나 음성 파일을 업로드하면 자동으로 핵심 내용을 요약하고, 여러 문서를 비교 분석하며, AI 기반 피드백을 제공합니다.",
    },
    {
      id: 2,
      category: "features",
      question: "어떤 파일 형식을 지원하나요?",
      answer: "문서는 PDF, DOCX, TXT 형식을 지원하며 최대 20MB, 200페이지까지 가능합니다. 음성은 MP3, WAV 형식을 지원하며 최대 60분까지 처리 가능합니다.",
    },
    {
      id: 3,
      category: "features",
      question: "다중 문서 비교는 어떻게 작동하나요?",
      answer: "최대 5개의 문서를 선택하여 비교할 수 있습니다. AI가 문서 간 추가된 내용, 삭제된 내용, 수정된 내용을 자동으로 분석하여 변화의 흐름을 시각화해 보여줍니다.",
    },
    {
      id: 4,
      category: "features",
      question: "AI 피드백 기능은 무엇인가요?",
      answer: "문서의 논리 구조, 누락 요소, 문장 흐름을 AI가 분석하여 개선점을 제안합니다. 마치 Notion AI처럼 문서 작성 과정에서 실시간으로 코칭을 받을 수 있습니다.",
    },
    {
      id: 5,
      category: "general",
      question: "회원가입이 필요한가요?",
      answer: "현재는 프로젝트 단계로, 향후 정식 서비스 출시 시 회원가입을 통해 문서 히스토리 관리, 개인화된 AI 피드백 등의 기능을 이용하실 수 있습니다.",
    },
    {
      id: 6,
      category: "security",
      question: "업로드한 문서는 안전한가요?",
      answer: "모든 파일은 AWS S3에 암호화되어 저장되며, 처리 후에는 사용자가 원할 경우 즉시 삭제됩니다. 개인정보 보호를 최우선으로 생각합니다.",
    },
    {
      id: 7,
      category: "billing",
      question: "서비스 이용 요금은 어떻게 되나요?",
      answer: "현재는 프로젝트 단계로 무료로 이용 가능합니다. 향후 정식 출시 시 기본 기능은 무료로 제공하고, 대용량 문서 처리나 팀 협업 기능은 유료 플랜으로 제공할 예정입니다.",
    },
    {
      id: 8,
      category: "features",
      question: "음성 파일은 어떻게 처리되나요?",
      answer: "Whisper AI 기반 STT 엔진을 사용하여 음성을 텍스트로 변환한 후, 자동으로 요약하고 구조화합니다. 회의록 형태로 정리되어 제공됩니다.",
    },
    {
      id: 9,
      category: "general",
      question: "모바일에서도 사용할 수 있나요?",
      answer: "네, 반응형 웹 디자인으로 구축되어 모바일, 태블릿, 데스크톱 모든 기기에서 최적화된 환경으로 이용하실 수 있습니다.",
    },
    {
      id: 10,
      category: "features",
      question: "요약 품질을 조절할 수 있나요?",
      answer: "네, 요약 길이(짧게/중간/길게)를 선택할 수 있으며, 키워드 중심 요약 또는 전체 맥락 요약 중 선택 가능합니다.",
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmit = async () => {
    if (
      !contactForm.name ||
      !contactForm.email ||
      !contactForm.subject ||
      !contactForm.message
    ) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          title: contactForm.subject,
          message: contactForm.message,
        }),
      });

      if (!res.ok) {
        throw new Error("메일 전송 실패");
      }

      setIsSubmitted(true);

      setTimeout(() => {
        setIsSubmitted(false);
        setContactForm({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      }, 3000);
    } catch (error) {
      alert("문의 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      console.error(error);
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-blue-500/5" />
        <div className="relative max-w-7xl mx-auto px-8 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <MessageSquare size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-600">고객센터</span>
          </div>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
            무엇을 도와드릴까요?
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            자주 묻는 질문을 확인하거나 직접 문의해주세요
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="궁금한 내용을 검색해보세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                카테고리
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeCategory === category.id
                        ? "bg-blue-500 text-white"
                        : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    {category.icon}
                    <span className="font-medium">{category.label}</span>
                    <span className="ml-auto text-sm">
                      {category.id === "all"
                        ? faqs.length
                        : faqs.filter((f) => f.category === category.id).length}
                    </span>
                  </button>
                ))}
              </div>

              {/* Contact Card */}
              <div className="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <Mail className="text-blue-600 mb-2" size={24} />
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                  직접 문의하기
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  원하는 답변을 찾지 못하셨나요?
                </p>
                <a
                  href="#contact"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  문의하기 →
                </a>
              </div>
            </div>
          </div>

          {/* Right: FAQ List */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                자주 묻는 질문
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {filteredFaqs.length}개의 질문이 있습니다
              </p>
            </div>

            <div className="space-y-4">
              {filteredFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <span className="font-semibold text-slate-900 dark:text-white pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`flex-shrink-0 text-slate-400 transition-transform ${
                        openFaqId === faq.id ? "rotate-180" : ""
                      }`}
                      size={20}
                    />
                  </button>
                  {openFaqId === faq.id && (
                    <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredFaqs.length === 0 && (
              <div className="text-center py-16">
                <MessageSquare className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={48} />
                <p className="text-slate-600 dark:text-slate-400">
                  검색 결과가 없습니다. 다른 키워드로 검색해보세요.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Form Section */}
        <section id="contact" className="mt-24 scroll-mt-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                문의하기
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                궁금한 점이 있으시면 언제든지 문의해주세요
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    문의가 접수되었습니다
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    빠른 시일 내에 답변드리겠습니다
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                        이름
                      </label>
                      <input
                        type="text"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="홍길동"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                        이메일
                      </label>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      제목
                    </label>
                    <input
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="문의 제목을 입력해주세요"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      문의 내용
                    </label>
                    <textarea
                      rows={6}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="문의 내용을 상세히 작성해주세요"
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Send size={20} />
                    문의 보내기
                  </button>
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
              <p>또는 직접 이메일로 문의하세요</p>
              <a
                href="mailto:flocut2025@gmail.com"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                flocut2025@gmail.com
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}