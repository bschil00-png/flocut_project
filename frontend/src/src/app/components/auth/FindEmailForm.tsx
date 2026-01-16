"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

import Input from "../ui/input/Input";
import Button from "@/app/components/ui/button/Button";
import AlertDialog from "@/app/components/ui/modal/AlertDialog";
import { findEmail } from "@/lib/rest/auth/auth.rest";

export default function FindEmailForm() {
    const [tel, setTel] = useState("");
    const [maskedEmails, setMaskedEmails] = useState<string[]>([]);
    const [alertOpen, setAlertOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isSuccess = maskedEmails.length > 0;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // 중복 실행 방지
        if (isSubmitting) return;

        setIsSubmitting(true);
        setLoading(true);
        setMaskedEmails([]);
        setAlertOpen(false);

        try {
            const res = await findEmail(tel);

            console.log("📦 find-email response:", res);

            // 응답 검증 및 처리
            if (!res || !Array.isArray(res.maskedEmails) || res.maskedEmails.length === 0) {
                setAlertOpen(true);
            } else {
                setMaskedEmails(res.maskedEmails);
            }

        } catch (error) {
            console.error("❌ findEmail error", error);
            setAlertOpen(true);
        } finally {
            setLoading(false);
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-sm text-text-muted-light hover:text-accent mb-4"
                    >
                        <ArrowLeft size={16} />
                        로그인으로 돌아가기
                    </Link>

                    <h1 className="text-3xl font-bold mb-2">아이디 찾기</h1>
                    <p className="text-text-muted-light">
                        가입 시 입력한 전화번호로 아이디를 찾습니다
                    </p>
                </div>

                {/* Card */}
                <div className="p-8 rounded-2xl bg-white border shadow-xl">
                    {isSuccess ? (
                        // ✅ 성공 화면
                        <div className="text-center">
                            <CheckCircle2 className="mx-auto mb-4 text-accent" size={40} />
                            <h3 className="text-xl font-bold mb-2">
                                아이디를 찾았습니다
                            </h3>

                            <div className="space-y-2 mb-6">
                                {maskedEmails.map((email, i) => (
                                    <div
                                        key={i}
                                        className="p-3 rounded bg-accent/5 border text-accent font-semibold"
                                    >
                                        {email}
                                    </div>
                                ))}
                            </div>

                            <Link href="/login">
                                <Button className="w-full">로그인하기</Button>
                            </Link>
                        </div>
                    ) : (
                        // 입력 폼
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <Input
                                label="전화번호"
                                value={tel}
                                onChange={(e) => setTel(e.target.value)}
                                placeholder="하이픈 없이 입력"
                                required
                                disabled={loading}
                            />

                            <Button
                                type="submit"
                                loading={loading}
                                disabled={loading || isSubmitting}
                                className="w-full"
                            >
                                아이디 찾기
                            </Button>
                        </form>
                    )}
                </div>
            </div>

            {/* 실패 알럿 */}
            {alertOpen && (
                <AlertDialog
                    open={alertOpen}
                    title="아이디 찾기 실패"
                    message="해당 전화번호로 가입된 이메일이 없습니다."
                    confirmText="확인"
                    onClose={() => setAlertOpen(false)}
                />
            )}
        </>
    );
}