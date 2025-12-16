"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";

import Card from "@/app/components/ui/card/Card";
import Form from "@/app/components/ui/form/Form";
import Input from "@/app/components/ui/form/Input";
import Button from "@/app/components/ui/button/Button";

export default function LoginForm() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await login(email, password);
            router.replace("/");
        } catch (e) {
            setError("이메일 또는 비밀번호가 올바르지 않습니다.");
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="w-full max-w-[420px]">
            <h1 className="text-2xl font-semibold text-center mb-8">로그인</h1>

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
                        <p className="text-sm text-red-500 text-center">{error}</p>
                    )}

                    <Button type="submit" className="w-full" loading={loading}>
                        로그인
                    </Button>

                    <Button type="button" variant="oauth" className="w-full">
                        Google로 로그인
                    </Button>
                </Form>
            </Card>
        </div>
    );
}
