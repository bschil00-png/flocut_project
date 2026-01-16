"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Lock } from "lucide-react";

import Input from "../ui/input/Input";
import Button from "@/app/components/ui/button/Button";
import {requestPasswordReset} from "@/lib/rest/auth/auth.rest";

type Step = "request" | "sent";

export default function ForgotPasswordForm() {
    // 입력 상태
    const [email, setEmail] = useState("");

    // UI 제어 상태
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<Step>("request");

    // 비밀번호 재설정 요청
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 이메일 형식 검증
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setError("올바른 이메일 형식을 입력해주세요.");
                setLoading(false);
                return;
            }

            // API 호출 - 백엔드 /auth/password/reset-request 엔드포인트 호출
            // 이메일을 전달하면 백엔드에서 토큰 생성 후 메일 발송
            await requestPasswordReset(email);

            // 성공 시 이메일 발송 완료 화면으로 전환
            setStep("sent");
        } catch (err: any) {
            // 에러 처리
            // 백엔드에서 "존재하지 않는 이메일" 또는 "이미 비밀번호 재설정 메일을 보냈습니다" 등의 에러 반환
            const errorMessage = err?.response?.data?.message ||
                err?.message ||
                "비밀번호 재설정 요청에 실패했습니다. 다시 시도해주세요.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
        >
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm text-text-muted-light dark:text-text-muted-dark hover:text-accent transition-colors mb-4"
                >

                    로그인으로 돌아가기
                </Link>
                <h1 className="text-3xl font-bold mb-2">
                    비밀번호 찾기
                </h1>
                <p className="text-text-muted-light dark:text-text-muted-dark">
                    {step === "request"
                        ? "가입한 이메일로 비밀번호 재설정 링크를 보내드립니다"
                        : "비밀번호 재설정 링크가 전송되었습니다"
                    }
                </p>
            </div>

            {/* Form Card */}
            <div className="p-8 rounded-2xl bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-xl">
                {step === "sent" ? (
                    /* Email Sent Message */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-center py-4"
                    >

                        <h3 className="text-xl font-bold mb-2">
                            이메일을 확인해주세요
                        </h3>
                        <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-1">
                            <span className="font-semibold text-accent">{email}</span>
                        </p>
                        <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-6">
                            위 주소로 비밀번호 재설정 링크를 발송했습니다.
                            <br />
                            이메일의 링크를 클릭하여 비밀번호를 재설정해주세요.
                        </p>

                        {/* Info Box */}
                        <div className="p-4 rounded-lg bg-accent/5 border border-accent/20 mb-6 text-left">
                            <p className="text-xs text-text-muted-light dark:text-text-muted-dark space-y-1">
                                <span className="block">이메일이 도착하지 않았나요?</span>
                                <span className="block ml-2">스팸 메일함을 확인해주세요.</span>
                                <span className="block">링크는 24시간 동안 유효합니다.</span>
                            </p>
                        </div>

                        <div className="space-y-3">
                            <Link href="/login">
                                <Button className="w-full">
                                    로그인 페이지로 이동
                                </Button>
                            </Link>
                            <Button
                                type="button"
                                variant="secondary"
                                className="w-full"
                                onClick={() => setStep("request")}
                            >
                                다시 요청하기
                            </Button>
                        </div>
                    </motion.div>
                ) : (
                    /* Password Reset Request Form */
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Input */}
                        <Input
                            label="이메일"
                            type="email"
                            value={email}
                            required
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError(null);
                            }}
                            placeholder="email@example.com"
                        />

                        {/* Info Message */}
                        <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                            <div className="flex gap-3">
                                <Lock size={20} className="text-accent flex-shrink-0 mt-0.5" />
                                <div className="text-xs text-text-muted-light dark:text-text-muted-dark space-y-1">
                                    <p>입력하신 이메일로 비밀번호 재설정 링크를 보내드립니다.</p>
                                    <p>이메일을 받지 못하셨다면 스팸 메일함을 확인해주세요.</p>
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                                <p className="text-sm text-red-500 text-center">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full"
                            loading={loading}
                        >
                            재설정 링크 보내기
                        </Button>
                    </form>
                )}
            </div>

            {/* Footer Links */}
            {step === "request" && (
                <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-center gap-6 text-sm">
                        <Link
                            href="/find-email"
                            className="text-text-muted-light dark:text-text-muted-dark hover:text-accent transition-colors"
                        >
                            이메일 찾기
                        </Link>
                        <span className="text-border-light dark:text-border-dark">|</span>
                        <Link
                            href="/login"
                            className="text-text-muted-light dark:text-text-muted-dark hover:text-accent transition-colors"
                        >
                            로그인
                        </Link>
                        <span className="text-border-light dark:text-border-dark">|</span>
                        <Link
                            href="/signup"
                            className="text-text-muted-light dark:text-text-muted-dark hover:text-accent transition-colors"
                        >
                            회원가입
                        </Link>
                    </div>
                </div>
            )}
        </motion.div>
    );
}