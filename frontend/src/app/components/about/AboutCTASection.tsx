"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function AboutCTASection() {
  const router = useRouter();

  const benefits = [
    "무료 체험 10건 제공",
    "신용카드 등록 불필요",
    "즉시 사용 가능"
  ];

  return (
    <section className="w-full py-24 bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 md:p-16 border border-slate-200 dark:border-slate-700 shadow-2xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
              지금 시작하세요
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              FloCut과 함께
              <br />
              <span className="text-accent">문서 업무를 혁신하세요</span>
            </h2>

            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              회원가입만으로 바로 시작할 수 있습니다.
              프로젝트의 최신 기능을 지금 경험해보세요.
            </p>

            {/* Benefits */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle size={18} className="text-accent" />
                  <span className="text-sm font-medium">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/signup")}
                className="group h-14 px-8 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold text-lg shadow-xl shadow-accent/30 transition-all inline-flex items-center gap-2"
              >
                무료로 시작하기
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <button
                onClick={() => router.push("/about")}
                className="h-14 px-8 rounded-xl border border-slate-300 dark:border-slate-600 hover:border-accent hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold transition-all"
              >
                더 알아보기
              </button>
            </div>

            {/* Trust indicator */}
            <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                이미 <span className="font-semibold text-accent">2,500+</span>개 팀이 FloCut으로 문서를 분석하고 있습니다
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}