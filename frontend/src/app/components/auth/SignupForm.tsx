"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

import Input from "../ui/input/Input";
import Checkbox from "@/app/components/ui/form/Checkbox";
import Button from "@/app/components/ui/button/Button";
import { MemberRegisterRequest } from "@/app/api/auth/auth.types";
import { register } from "@/lib/rest/auth/auth.rest";

export default function SignupForm() {
    // 서버 전송 데이터
    const [form, setForm] = useState<MemberRegisterRequest>({
        email: "",
        password: "",
        name: "",
        tel: "",
        agreeTerms: false,
    });

    // 프론트 전용 상태
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [openTermsModal, setOpenTermsModal] = useState(false);

    const handleChange =
        (key: keyof MemberRegisterRequest) =>
            (e: React.ChangeEvent<HTMLInputElement>) => {
                setForm(prev => ({
                    ...prev,
                    [key]: e.target.value,
                }));
                setError(null);
            };

    // 회원가입 제출
    const handleSubmit = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setError(null);

            // 이메일
            if (!form.email) {
                setError("이메일을 입력해주세요.");
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(form.email)) {
                setError("올바른 이메일 형식을 입력해주세요.");
                return;
            }

            // 이름
            if (!form.name) {
                setError("이름을 입력해주세요.");
                return;
            }

            // 전화번호 (필수)
            if (!form.tel) {
                setError("전화번호를 입력해주세요.");
                return;
            }

            const tel = form.tel.replaceAll("-", "");
            const telRegex = /^[0-9]{10,11}$/;
            if (!telRegex.test(tel)) {
                setError("전화번호 형식이 올바르지 않습니다.");
                return;
            }

            // 비밀번호
            if (!form.password) {
                setError("비밀번호를 입력해주세요.");
                return;
            }

            if (form.password.length < 8) {
                setError("비밀번호는 8자 이상이어야 합니다.");
                return;
            }

            if (form.password !== passwordConfirm) {
                setError("비밀번호가 일치하지 않습니다.");
                return;
            }

            // 약관 동의
            if (!form.agreeTerms) {
                setError("서비스 이용약관에 동의해주세요.");
                return;
            }

            setLoading(true);
            try {
                await register({
                    ...form,
                    tel, // 하이픈 제거된 전화번호 전송
                });
                setSuccess(true);
            } catch (err: any) {
                const message =
                    err?.response?.data?.message ??
                    "회원가입에 실패했습니다. 다시 시도해주세요.";
                setError(message);
            } finally {
                setLoading(false);
            }
        },
        [form, passwordConfirm]
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
        >
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">회원가입</h1>
                <p className="text-text-muted-light dark:text-text-muted-dark">
                    FloCut과 함께 문서 분석을 시작하세요
                </p>
            </div>

            {/* Form Card */}
            <div className="p-8 rounded-2xl bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-xl">
                {success ? (
                    /* Success */
                    <div className="text-center py-4">
                        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mx-auto mb-4">
                            <CheckCircle size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                            인증 메일을 발송했습니다
                        </h3>
                        <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-6">
                            {form.email} 주소로 인증 메일을 발송했습니다.
                            <br />
                            인증 후 로그인을 진행해주세요.
                        </p>
                        <Link href="/login">
                            <Button className="w-full">로그인 페이지로 이동</Button>
                        </Link>
                    </div>
                ) : (
                    /* Form */
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="이메일"
                            type="email"
                            value={form.email}
                            onChange={handleChange("email")}
                            placeholder="email@example.com"
                            required
                        />

                        <Input
                            label="이름"
                            value={form.name}
                            onChange={handleChange("name")}
                            placeholder="홍길동"
                            required
                        />

                        <Input
                            label="전화번호"
                            value={form.tel}
                            onChange={handleChange("tel")}
                            placeholder="01012345678"
                            required
                        />

                        <Input
                            label="비밀번호"
                            type="password"
                            value={form.password}
                            onChange={handleChange("password")}
                            placeholder="8자 이상 입력"
                            required
                        />

                        <Input
                            label="비밀번호 확인"
                            type="password"
                            value={passwordConfirm}
                            onChange={e => {
                                setPasswordConfirm(e.target.value);
                                setError(null);
                            }}
                            placeholder="비밀번호 재입력"
                            required
                        />

                        <Checkbox
                            label="서비스 이용약관에 동의합니다"
                            checked={form.agreeTerms}
                            required
                            onChange={checked =>
                                setForm(prev => ({ ...prev, agreeTerms: checked }))
                            }
                            actionText="약관 보기"
                            onActionClick={() => setOpenTermsModal(true)}
                        />

                        {error && (
                            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                                <p className="text-sm text-red-500 text-center">{error}</p>
                            </div>
                        )}

                        <Button type="submit" className="w-full" loading={loading}>
                            회원가입
                        </Button>
                    </form>
                )}
            </div>

            {!success && (
                <div className="mt-6 text-center">
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                        이미 계정이 있으신가요?{" "}
                        <Link
                            href="/login"
                            className="text-accent hover:text-accent-hover font-medium"
                        >
                            로그인
                        </Link>
                    </p>
                </div>
            )}
        </motion.div>
    );
}
