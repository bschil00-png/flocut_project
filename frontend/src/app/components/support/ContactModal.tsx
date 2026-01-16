"use client";

import { useState } from "react";
import { Send, CheckCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
        message: "",
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

        setIsSubmitting(true);

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: contactForm.name,
                    email: contactForm.email,
                    title: contactForm.subject,
                    message: contactForm.message,
                }),
            });

            if (!res.ok) throw new Error("메일 전송 실패");

            // 전송 성공 시 완료 화면으로 전환 (자동으로 닫히는 setTimeout 제거)
            setIsSubmitted(true);

            // 입력 폼 초기화는 여기서 진행
            setContactForm({
                name: "",
                email: "",
                subject: "",
                message: "",
            });

        } catch (error) {
            alert("문의 전송 중 오류가 발생했습니다.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 모달 닫기 시 상태 초기화 함수 (완료 화면에서 닫을 때 다음번을 위해 초기화)
    const handleClose = () => {
        onClose();
        // 약간의 딜레이를 주어 닫히는 애니메이션 중 화면이 변하지 않게 함
        setTimeout(() => {
            setIsSubmitted(false);
        }, 200);
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark shadow-2xl overflow-hidden mt-[calc(env(safe-area-inset-top,1rem)+1rem)] sm:mt-0 max-h-[calc(100dvh-env(safe-area-inset-top)-2rem)] flex flex-col transition-colors"
            >
                {/* Header */}
                <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-border-light dark:border-border-dark pt-[calc(env(safe-area-inset-top,0.5rem)+1rem)] sm:pt-4">
                    <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark tracking-tight">문의하기</h2>
                    <IconButton icon={<X size={20} className="text-text-primary-light dark:text-text-primary-dark" />} onClick={handleClose} />
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isSubmitted ? (
                        <div className="text-center py-12">
                            <CheckCircle className="mx-auto text-accent mb-4" size={64} />
                            <h3 className="text-2xl font-bold mb-2 text-text-primary-light dark:text-text-primary-dark">
                                문의가 접수되었습니다
                            </h3>
                            <p className="text-text-muted-light dark:text-text-muted-dark font-medium mb-8">
                                빠른 시일 내에 답변드리겠습니다
                            </p>
                            <button
                                onClick={handleClose}
                                className="px-8 py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl transition-all shadow-lg shadow-accent/20"
                            >
                                확인
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            <div className="grid md:grid-cols-2 gap-5">
                                <InputField
                                    label="이름"
                                    value={contactForm.name}
                                    onChange={(v) => setContactForm({ ...contactForm, name: v })}
                                    placeholder="홍길동"
                                />
                                <InputField
                                    label="이메일"
                                    value={contactForm.email}
                                    onChange={(v) => setContactForm({ ...contactForm, email: v })}
                                    placeholder="email@example.com"
                                />
                            </div>

                            <InputField
                                label="제목"
                                value={contactForm.subject}
                                onChange={(v) => setContactForm({ ...contactForm, subject: v })}
                                placeholder="문의 제목을 입력해주세요"
                            />

                            <TextAreaField
                                label="문의 내용"
                                value={contactForm.message}
                                onChange={(v) => setContactForm({ ...contactForm, message: v })}
                                placeholder="문의 내용을 상세히 작성해주세요"
                            />

                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-accent/20"
                            >
                                {isSubmitting ? (
                                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : (
                                    <>
                                        <Send size={18} />
                                        문의 보내기
                                    </>
                                )}
                            </button>

                            <div className="text-center text-[11px] font-bold tracking-widest text-text-muted-light dark:text-text-muted-dark pt-4 border-t border-border-light dark:border-border-dark pb-[env(safe-area-inset-bottom,1rem)] transition-colors">
                                <p className="mb-1">직접 이메일 문의</p>
                                <a href="mailto: flocut2025@gmail.com" className="text-accent hover:underline">
                                    flocut2025@gmail.com
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

/* ----------------- helpers ----------------- */

function InputField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
    return (
        <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-text-muted-light dark:text-text-muted-dark mb-2">{label}</label>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                placeholder={placeholder}
            />
        </div>
    );
}

function TextAreaField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
    return (
        <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-text-muted-light dark:text-text-muted-dark mb-2">{label}</label>
            <textarea
                rows={6}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent resize-none transition-all"
                placeholder={placeholder}
            />
        </div>
    );
}