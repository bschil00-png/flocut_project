"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowLeft, Eye, EyeOff, CheckCircle2 } from "lucide-react";

import Input from "@/app/components/ui/input/Input";
import Button from "@/app/components/ui/button/Button";
import { resetPassword } from "@/lib/rest/auth/auth.rest";

type Step = "reset" | "success";

export default function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    // 입력 상태
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // UI 제어 상태
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<Step>("reset");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // 토큰 검증
    useEffect(() => {
        if (!token) {
            setError("유효하지 않은 링크입니다.");
        }
    }, [token]);

    // 비밀번호 유효성 검사
    const validatePassword = (password: string): string | null => {
        if (password.length < 8) {
            return "비밀번호는 최소 8자 이상이어야 합니다.";
        }
        if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
            return "비밀번호는 영문과 숫자를 포함해야 합니다.";
        }
        return null;
    };

    // 비밀번호 재설정 제출
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 토큰 체크
            if (!token) {
                setError("유효하지 않은 링크입니다.");
                setLoading(false);
                return;
            }

            // 비밀번호 유효성 검사
            const passwordError = validatePassword(newPassword);
            if (passwordError) {
                setError(passwordError);
                setLoading(false);
                return;
            }

            // 비밀번호 일치 확인
            if (newPassword !== confirmPassword) {
                setError("비밀번호가 일치하지 않습니다.");
                setLoading(false);
                return;
            }

            // API 호출 - 백엔드 /auth/password/reset 엔드포인트 호출
            // token과 newPassword를 전달하여 비밀번호 변경
            await resetPassword(token, newPassword);

            // 성공 시 완료 화면으로 전환
            setStep("success");
        } catch (err: any) {
            // 에러 처리
            // 백엔드에서 "유효하지 않은 토큰", "만료된 토큰", "기존 비밀번호와 동일합니다" 등의 에러 반환
            const errorMessage = err?.response?.data?.message ||
                err?.message ||
                "비밀번호 변경에 실패했습니다. 다시 시도해주세요.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    // 로그인 페이지로 이동
    const handleGoToLogin = () => {
        router.push("/login");
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
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm text-text-muted-light dark:text-text-muted-dark hover:text-accent transition-colors mb-4"
                >
                    <ArrowLeft size={16} />
                    로그인으로 돌아가기
                </Link>
                <h1 className="text-3xl font-bold mb-2">
                    {step === "reset" ? "새 비밀번호 설정" : "비밀번호 변경 완료"}
                </h1>
                <p className="text-text-muted-light dark:text-text-muted-dark">
                    {step === "reset"
                        ? "새로운 비밀번호를 입력해주세요"
                        : "새로운 비밀번호로 변경되었습니다"
                    }
                </p>
            </div>

            {/* Form Card */}
            <div className="p-8 rounded-2xl bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-xl">
                {step === "success" ? (
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
                                <CheckCircle2 size={36} strokeWidth={2.5} className="text-white" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                            비밀번호 변경 완료
                        </h3>
                        <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-6">
                            새로운 비밀번호로 변경되었습니다.
                            <br />
                            변경된 비밀번호로 로그인해주세요.
                        </p>

                        {/* Info Box */}
                        <div className="p-4 rounded-lg bg-accent/5 border border-accent/20 mb-6 text-left">
                            <p className="text-xs text-text-muted-light dark:text-text-muted-dark space-y-1">
                                <span className="block">변경된 비밀번호는 안전하게 보관해주세요.</span>
                                <span className="block">정기적인 비밀번호 변경을 권장합니다.</span>
                            </p>
                        </div>

                        <Button onClick={handleGoToLogin} className="w-full">
                            로그인 페이지로 이동
                        </Button>
                    </motion.div>
                ) : (
                    /* Password Reset Form */
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* New Password Input */}
                        <div className="relative">
                            <Input
                                label="새 비밀번호"
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                required
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                    setError(null);
                                }}
                                placeholder="8자 이상, 영문+숫자 조합"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-[38px] text-text-muted-light dark:text-text-muted-dark hover:text-accent transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {/* Confirm Password Input */}
                        <div className="relative">
                            <Input
                                label="비밀번호 확인"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                required
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setError(null);
                                }}
                                placeholder="비밀번호를 다시 입력해주세요"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-[38px] text-text-muted-light dark:text-text-muted-dark hover:text-accent transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {/* Info Message */}
                        <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                            <div className="flex gap-3">
                                <Lock size={20} className="text-accent flex-shrink-0 mt-0.5" />
                                <div className="text-xs text-text-muted-light dark:text-text-muted-dark space-y-1">
                                    <p>비밀번호는 8자 이상이어야 합니다.</p>
                                    <p>영문과 숫자를 포함해야 합니다.</p>
                                    <p>기존 비밀번호와 동일할 수 없습니다.</p>
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
                            disabled={!token}
                        >
                            비밀번호 변경
                        </Button>
                    </form>
                )}
            </div>

            {/* Footer Links */}
            {step === "reset" && (
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