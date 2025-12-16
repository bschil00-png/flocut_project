"use client";

import {useCallback, useState} from "react";
import Card from "@/app/components/ui/card/Card";
import Form from "@/app/components/ui/form/Form";
import Input from "@/app/components/ui/form/Input";
import Checkbox from "@/app/components/ui/form/Checkbox";
import Button from "@/app/components/ui/button/Button";
import {MemberRegisterRequest} from "@/app/api/auth/auth.types";
import {authApi} from "@/app/api/auth/authApi";

export default function SignupForm() {
  //  이후에 스키마 기반 유틸리티 사용해서 유효성 검사 예정

  // ===== 서버로 보낼 데이터 (DTO 기준) =====
  const [form, setForm] = useState<MemberRegisterRequest>({
    email: "",
    password: "",
    name: "",
    agreeTerms: false,
  });

  // ===== 프론트 전용 상태 =====
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange =
    (key: keyof MemberRegisterRequest) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({
          ...prev,
          [key]: e.target.value,
        }));
      };
  // 약관 모달 열림 여부
  const [openTermsModal, setOpenTermsModal] = useState(false);

  const handleAgreeChange = (checked: boolean) => {
    setForm(prev => ({
      ...prev,
      agreeTerms: checked,
    }));
  };

  // 회원가입 (useCallback 사용으로 불필요한 리렌더 사용 방지)
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!form.agreeTerms) return;
      if (form.password !== passwordConfirm) return;

      setLoading(true);
      try {
        await authApi.register(form);
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


          <Button
            type="submit"
            className="w-full"
            loading={loading}
          >
            회원가입
          </Button>
        </Form>
      </Card>
    </div>
  );
}
