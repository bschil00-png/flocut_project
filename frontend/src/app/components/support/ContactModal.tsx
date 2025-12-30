"use client";

import { useState } from "react";
import { Send, CheckCircle, X } from "lucide-react";
import { motion } from "framer-motion";
import ModalOverlay from "@/app/components/ui/modal/ModalOverlay";
import IconButton from "@/app/components/ui/icon-button/IconButton";

type ContactModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function ContactModal({ open, onClose }: ContactModalProps) {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          title: contactForm.subject,
          message: contactForm.message
        })
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
          message: ""
        });
        onClose();
      }, 3000);
    } catch (error) {
      alert("문의 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <ModalOverlay onClose={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold">
              문의하기
            </h2>
            <IconButton icon={<X size={20} />} onClick={onClose} />
          </div>

          {/* Content */}
          <div className="p-6">
            {isSubmitted ? (
              <div className="text-center py-12">
                <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
                <h3 className="text-2xl font-bold mb-2">
                  문의가 접수되었습니다
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  빠른 시일 내에 답변드리겠습니다
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      이름
                    </label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="홍길동"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      이메일
                    </label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    제목
                  </label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="문의 제목을 입력해주세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    문의 내용
                  </label>
                  <textarea
                    rows={6}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                    placeholder="문의 내용을 상세히 작성해주세요"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <Send size={20} />
                      문의 보내기
                    </>
                  )}
                </button>

                <div className="text-center text-sm text-slate-600 dark:text-slate-400 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p>또는 직접 이메일로 문의하세요</p>
                  <a
                    href="mailto:flocut2025@gmail.com"
                    className="text-accent hover:underline font-medium"
                  >
                    flocut2025@gmail.com
                  </a>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}