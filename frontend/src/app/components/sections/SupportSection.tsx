"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronRight, HelpCircle, ArrowUpRight, Eye } from "lucide-react";

export default function SupportSection() {
  const router = useRouter();

  const faqs = [
    {
      question: "FLOCUT AI 분석 기능은 어떻게 작동하나요?",
      date: "2025.12.28",
      views: "1.2K"
    },
    {
      question: "문서 비교 기능에서 지원하는 파일 형식은 무엇인가요?",
      date: "2025.12.25",
      views: "856"
    },
    {
      question: "음성 파일 업로드 및 변환 시 주의사항",
      date: "2025.12.20",
      views: "623"
    }
  ];

  return (
    <section className="w-full py-28 bg-background-light dark:bg-background-dark transition-colors">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Left - Header (정적 배치로 변경하여 차분함 강조) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Icon - 공용 surface 및 border 컬러 적용 */}
              <div className="w-12 h-12 rounded-xl bg-surface-light dark:bg-surface-hover border border-border-light dark:border-border-dark flex items-center justify-center text-accent mb-8">
                <HelpCircle size={24} strokeWidth={1.5} />
              </div>

              <h3 className="text-3xl font-bold mb-4 tracking-tight text-text-primary-light dark:text-text-primary-dark">
                자주 묻는 질문
              </h3>

              <p className="text-lg text-text-muted-light dark:text-text-muted-dark mb-8 leading-relaxed">
                FLOCUT 서비스 이용에 관해<br />
                궁금한 점들을 모아두었습니다.
              </p>

              <button
                onClick={() => router.push("/support")}
                className="group flex items-center gap-2 text-sm font-bold text-accent hover:underline transition-all"
              >
                도움말 센터 바로가기
                <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right - FAQ List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid gap-3">
              {faqs.map((faq, index) => (
                <button
                  key={index}
                  onClick={() => router.push("/support")}
                  className="group w-full p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:border-accent/40 transition-all duration-300 text-left hover:shadow-xl hover:shadow-accent/5"
                >
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-bold mb-3 text-text-primary-light dark:text-text-primary-dark group-hover:text-accent transition-colors truncate">
                        {faq.question}
                      </h4>
                      <div className="flex items-center gap-6 text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest">
                        <span className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-accent" />
                          {faq.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Eye size={13} />
                          {faq.views} views
                        </span>
                      </div>
                    </div>

                    <div className="w-10 h-10 rounded-full border border-border-light dark:border-border-dark flex items-center justify-center text-text-muted-light group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all flex-shrink-0">
                      <ChevronRight size={18} strokeWidth={2} />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Need more help - 공용 컬러 및 dashed border 적용 */}
            <div className="mt-8 p-8 rounded-2xl bg-surface-light dark:bg-surface-dark border border-dashed border-border-light dark:border-border-dark">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h4 className="text-xl font-bold mb-1 text-text-primary-light dark:text-text-primary-dark">
                    원하는 답변을 찾지 못하셨나요?
                  </h4>
                  <p className="text-sm text-text-muted-light dark:text-text-muted-dark font-medium">
                    1:1 문의를 남겨주시면 담당자가 신속히 답변해 드립니다.
                  </p>
                </div>
                <button
                  onClick={() => router.push("/support")}
                  className="h-12 px-8 rounded-xl bg-accent hover:bg-accent-hover text-white font-bold transition-all shadow-lg shadow-accent/10 active:scale-95 flex-shrink-0"
                >
                  문의하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}