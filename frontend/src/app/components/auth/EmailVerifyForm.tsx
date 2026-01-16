"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

import Button from "@/app/components/ui/button/Button";
import Input from "../ui/input/Input";
import { sendVerifyEmail } from "../../../lib/rest/auth/auth.rest";

export default function EmailVerifyForm() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSend = async () => {
        // 이메일 유효성 검사
        if (!email) {
            setError("이메일을 입력해주세요.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("올바른 이메일 형식을 입력해주세요.");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await sendVerifyEmail(email);
            setSuccess(true);
        } catch {
            setError("인증 메일 발송에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    };

    // Enter 키 처리
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !loading) {
            handleSend();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
        >
            {/* Header */}
            <div className="mb-8">
                <div className="relative w-20 h-20 mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent to-accent/60 rounded-2xl rotate-6 opacity-20 blur-xl"></div>
                    <div className="relative w-full h-full bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center shadow-lg shadow-accent/25">
                        <ShieldCheck size={40} strokeWidth={2.5} className="text-white" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold mb-2">
                    이메일 인증
                </h1>
                <p className="text-text-muted-light dark:text-text-muted-dark">
                    입력하신 이메일로 인증 링크를 발송해드립니다
                </p>
            </div>

            {/* Form Card */}
            <div className="p-8 rounded-2xl bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-xl">
                {!success ? (
                    <div className="space-y-5">
                        {/* Email Input */}
                        <Input
                            label="이메일"
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError(null);
                            }}
                            onKeyPress={handleKeyPress}
                            placeholder="email@example.com"
                            required
                        />

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                                <p className="text-sm text-red-500 text-center">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Info Message */}
                        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                            <p className="text-sm text-blue-600 dark:text-blue-400 leading-relaxed">
                                인증 메일이 스팸함에 있을 수 있습니다.
                                메일이 도착하지 않으면 스팸함을 확인해주세요.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <Button
                            onClick={handleSend}
                            loading={loading}
                            className="w-full"
                        >
                            인증 메일 발송
                        </Button>
                    </div>
                ) : (
                    /* Success Message */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-center py-4"
                    >
                        <div className="relative w-20 h-20 mx-auto mb-6">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-400 rounded-2xl rotate-6 opacity-20 blur-xl"></div>
                            <div className="relative w-full h-full bg-gradient-to-br from-green-500 to-green-400 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25">
                                <CheckCircle2 size={40} strokeWidth={2.5} className="text-white" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                            인증 메일 발송 완료
                        </h3>
                        <p className="text-text-muted-light dark:text-text-muted-dark mb-6">
                            <span className="font-semibold text-accent">{email}</span>
                            <br />
                            위 주소로 인증 메일을 발송했습니다.
                        </p>
                        <div className="space-y-3">
                            <Button
                                onClick={() => {
                                    setSuccess(false);
                                    setEmail("");
                                }}
                                variant="secondary"
                                className="w-full"
                            >
                                다른 이메일로 재전송
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Footer Links */}
            <div className="mt-6 space-y-4">
                {/* Back to Login */}
                <div className="text-center">
                    <Link
                        href="/login"
                        className="text-sm text-text-muted-light dark:text-text-muted-dark hover:text-accent transition-colors"
                    >
                        ← 로그인으로 돌아가기
                    </Link>
                </div>

                {/* Additional Help */}
                <div className="p-4 rounded-xl bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-center">
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-2">
                        메일이 도착하지 않나요?
                    </p>
                    <div className="flex items-center justify-center gap-4 text-xs">
                        <button
                            onClick={handleSend}
                            disabled={loading || !email}
                            className="text-accent hover:text-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            재발송하기
                        </button>
                        <span className="text-border-light dark:text-border-dark">|</span>
                        <Link
                            href="/support"
                            className="text-text-muted-light dark:text-text-muted-dark hover:text-accent transition-colors"
                        >
                            고객센터 문의
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}