"use client";

import { useState } from "react";
import { MessageSquare, FileText, Settings, Shield } from "lucide-react";
import SupportHeroSection from "@/app/components/support/SupportHeroSection";
import SupportCategories from "@/app/components/support/SupportCategories";
import SupportFAQList from "@/app/components/support/SupportFAQList";
import ContactModal from "@/app/components/support/ContactModal";

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const categories = [
    { id: "all", label: "전체", icon: <FileText size={18} /> },
    { id: "general", label: "일반", icon: <MessageSquare size={18} /> },
    { id: "features", label: "기능", icon: <Settings size={18} /> },
    { id: "security", label: "보안", icon: <Shield size={18} /> }
  ];

  const faqs = [
    {
      id: 1,
      category: "general",
      question: "FloCut은 어떤 서비스인가요?",
      answer: "FloCut은 AI 기반 문서 및 음성 요약 플랫폼입니다. PDF, DOCX 문서를 업로드하거나 음성 파일을 업로드하면 자동으로 핵심 내용을 요약하고, 여러 문서를 비교 분석하며, AI 기반 피드백을 제공합니다."
    },
    {
      id: 2,
      category: "features",
      question: "어떤 파일 형식을 지원하나요?",
      answer: "문서는 PDF, DOCX, TXT 형식을 지원하며 최대 20MB, 200페이지까지 가능합니다. 음성은 MP3, WAV 형식을 지원하며 최대 60분까지 처리 가능합니다."
    },
    {
      id: 3,
      category: "features",
      question: "다중 문서 비교는 어떻게 작동하나요?",
      answer: "최대 5개의 문서를 선택하여 비교할 수 있습니다. AI가 문서 간 추가된 내용, 삭제된 내용, 수정된 내용을 자동으로 분석하여 변화의 흐름을 시각화해 보여줍니다."
    },
    {
      id: 4,
      category: "features",
      question: "AI 피드백 기능은 무엇인가요?",
      answer: "문서의 논리 구조, 누락 요소, 문장 흐름을 AI가 분석하여 개선점을 제안합니다. 마치 Notion AI처럼 문서 작성 과정에서 실시간으로 코칭을 받을 수 있습니다."
    },
    {
      id: 5,
      category: "general",
      question: "회원가입이 필요한가요?",
      answer: "현재는 프로젝트 단계로, 향후 정식 서비스 출시 시 회원가입을 통해 문서 히스토리 관리, 개인화된 AI 피드백 등의 기능을 이용하실 수 있습니다."
    },
    {
      id: 6,
      category: "security",
      question: "업로드한 문서는 안전한가요?",
      answer: "모든 파일은 AWS S3에 암호화되어 저장되며, 처리 후에는 사용자가 원할 경우 즉시 삭제됩니다. 개인정보 보호를 최우선으로 생각합니다."
    },
    {
      id: 7,
      category: "general",
      question: "서비스 이용 요금은 어떻게 되나요?",
      answer: "FloCut은 완전 무료로 제공됩니다. 프로젝트 단계이며, 모든 기능을 제한 없이 이용하실 수 있습니다."
    },
    {
      id: 8,
      category: "features",
      question: "음성 파일은 어떻게 처리되나요?",
      answer: "Whisper AI 기반 STT 엔진을 사용하여 음성을 텍스트로 변환한 후, 자동으로 요약하고 구조화합니다. 회의록 형태로 정리되어 제공됩니다."
    },
    {
      id: 9,
      category: "general",
      question: "모바일에서도 사용할 수 있나요?",
      answer: "네, 반응형 웹 디자인으로 구축되어 모바일, 태블릿, 데스크톱 모든 기기에서 최적화된 환경으로 이용하실 수 있습니다."
    },
    {
      id: 10,
      category: "features",
      question: "요약 품질을 조절할 수 있나요?",
      answer: "네, 요약 길이(짧게/중간/길게)를 선택할 수 있으며, 키워드 중심 요약 또는 전체 맥락 요약 중 선택 가능합니다."
    },
    {
      id: 11,
      category: "security",
      question: "데이터는 얼마나 오래 보관되나요?",
      answer: "업로드된 파일과 생성된 요약본은 사용자가 삭제하기 전까지 안전하게 보관됩니다. 언제든지 삭제하실 수 있으며, 삭제 즉시 서버에서 완전히 제거됩니다."
    },
    {
      id: 12,
      category: "features",
      question: "여러 언어를 지원하나요?",
      answer: "현재는 한국어를 주요 지원하며, 영어 문서도 처리 가능합니다. 향후 다국어 지원을 확대할 예정입니다."
    }
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <SupportHeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <SupportCategories
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              faqCount={filteredFaqs.length}
              onContactClick={() => setIsContactModalOpen(true)}
            />
          </div>

          {/* Main - FAQ List */}
          <div className="lg:col-span-2">
            <SupportFAQList
              faqs={filteredFaqs}
              openFaqId={openFaqId}
              onToggleFaq={(id) => setOpenFaqId(openFaqId === id ? null : id)}
            />
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal
        open={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
}