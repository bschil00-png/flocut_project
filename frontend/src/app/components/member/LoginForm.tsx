"use client"


import {useState} from "react";
import Card from "@/app/components/ui/Card";
import Form from "@/app/components/ui/Form";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";

export default function LoginForm() {
//     입력 값 상태
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

//     error 상태
    const [emailError, setEmailError] = useState<string | undefined>();
    const [passwordError, setPasswordError] = useState<string | undefined>();


//     로딩 상태
    const [loading, setLoading] = useState(false);
    //  소셜
    const [socialLoading, setSocialLoading] = useState(false);

    return (
        <div className="w-full max-w-[420px]">
            <h1 className="text-2xl font-semibold text-center mb-8">
                로그인
            </h1>

            <Card padding="lg">
                <Form loading={loading}>
                    <Input
                        label="이메일"
                        placeholder="이메일을 작성해 주세요!"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={emailError}
                    />

                    <Input
                        label="비밀번호"
                        placeholder="비밀번호를 작성해 주세요!"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={passwordError}
                    />

                    <div className="text-right text-sm">
                        {/*나중에 경로 비밀 번호 찾기로 수정하기*/}
                        <a
                            href="#"
                            className="
                            text-text-muted-light
                            hover:text-text-primary-light
                            dark:text-text-muted-dark"
                        >
                            비밀번호를 잊으셨나요?
                        </a>
                    </div>
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
                        loading={socialLoading}
                        className="w-full"
                    >
                        Google로 로그인
                    </Button>

                </Form>
            </Card>
        </div>
    )
}