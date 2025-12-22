"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthActions } from "@/hooks/useAuthActions";

// UI 컴포넌트
import Card from "@/app/components/ui/card/Card";
import Form from "@/app/components/ui/form/Form";
import Input from "@/app/components/ui/form/Input";
import Button from "@/app/components/ui/button/Button";

// 소셜 로그인 핸들러
import { googleLoginHandler } from "@/lib/rest/auth.social";

export default function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuthActions();

    // 입력 상태
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // UI 제어용 상태
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    //  Google 로그인 에러 처리
    useEffect(() => {
        const errorParam = searchParams.get("error");

        if (errorParam === "no_code") {
            setError("인증 코드가 없습니다.");
        } else if (errorParam === "google_failed") {
            setError("구글 로그인에 실패했습니다.");
        } else if (errorParam === "unexpected") {
            setError("구글 로그인 중 오류가 발생했습니다.");
        }

        // URL에서 error 파라미터 제거 (깔끔하게)
        if (errorParam) {
            const newUrl = window.location.pathname;
            window.history.replaceState({}, "", newUrl);
        }
    }, [searchParams]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            await login(email, password);
            router.replace("/");
        } catch {
            setError("이메일 또는 비밀번호가 올바르지 않습니다.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-[420px]">
            <h1 className="text-2xl font-semibold text-center mb-8">
                로그인
            </h1>

            <Card padding="lg">
                <Form loading={loading} onSubmit={handleSubmit}>
                    <Input
                        label="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input
                        label="비밀번호"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && (
                        <p className="text-sm text-red-500 text-center">
                            {error}
                        </p>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        loading={loading}
                    >
                        로그인
                    </Button>

                    <Button
                        type="button"
                        variant="oauth"
                        className="w-full"
                        onClick={googleLoginHandler}
                    >
                        Google로 로그인
                    </Button>
                </Form>
            </Card>
        </div>
    );
}