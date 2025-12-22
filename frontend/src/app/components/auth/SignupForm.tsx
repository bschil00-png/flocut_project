"use client";

import { useCallback, useState } from "react";
import Card from "@/app/components/ui/card/Card";
import Form from "@/app/components/ui/form/Form";
import Input from "@/app/components/ui/form/Input";
import Checkbox from "@/app/components/ui/form/Checkbox";
import Button from "@/app/components/ui/button/Button";
import { MemberRegisterRequest } from "@/app/api/auth/auth.types";
import { register } from "@/lib/rest/auth.rest";

export default function SignupForm() {
  // 서버로 보낼 데이터
  const [form, setForm] = useState<MemberRegisterRequest>({
    email: "",
    password: "",
    name: "",
    agreeTerms: false,
  });

  // 프론트 전용 상태
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [openTermsModal, setOpenTermsModal] = useState(false);

  const handleChange =
    (key: keyof MemberRegisterRequest) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({
          ...prev,
          [key]: e.target.value,
        }));
      };

  // 회원가입 제출
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!form.agreeTerms) {
        alert("약관에 동의해야 합니다.");
        return;
      }

      if (form.password !== passwordConfirm) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }

      setLoading(true);
      try {
        await register(form);
        setSuccess(true);
      } catch {
        alert("회원가입에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    },
    [form, passwordConfirm]
  );

  return (
    <div className="w-full max-w-[420px]">
      <h1 className="text-2xl font-semibold text-center mb-8">
        회원가입
      </h1>

      <Card padding="lg">
        {success ? (
          <div className="flex flex-col items-center text-center space-y-5 py-4">
            {/* 상태 아이콘 */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* 메시지 */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">
                인증 메일을 보냈습니다
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">
                입력하신 이메일로 인증 메일을 발송했습니다.<br />
                인증을 완료하신 후 로그인을 진행하실 수 있습니다.
              </p>
            </div>
          </div>
        ) : (

          <Form loading={loading} onSubmit={handleSubmit}>
            <Input
              label="이메일"
              value={form.email}
              onChange={handleChange("email")}
            />

            <Input
              label="이름"
              value={form.name}
              onChange={handleChange("name")}
            />

            <Input
              label="비밀번호"
              type="password"
              value={form.password}
              onChange={handleChange("password")}
            />

            <Input
              label="비밀번호 확인"
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />

            <Checkbox
              label="서비스 이용약관에 동의합니다"
              required
              checked={form.agreeTerms}
              onChange={(checked) =>
                setForm(prev => ({ ...prev, agreeTerms: checked }))
              }
              actionText="약관 보기"
              onActionClick={() => setOpenTermsModal(true)}
              helperText="회원가입을 위해 필수 동의입니다."
            />

            <Button type="submit" className="w-full" loading={loading}>
              회원가입
            </Button>
          </Form>
        )}
      </Card>

      {openTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">
              서비스 이용약관
            </h2>

            <div className="text-sm text-gray-700 max-h-60 overflow-y-auto mb-6">
              여기에 약관 내용이 들어갑니다...
            </div>

            <Button
              type="button"
              className="w-full"
              onClick={() => setOpenTermsModal(false)}
            >
              닫기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
