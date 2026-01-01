"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { UserPlus, CheckCircle, X } from "lucide-react";

import Input from "../ui/input/Input";
import Checkbox from "@/app/components/ui/form/Checkbox";
import Button from "@/app/components/ui/button/Button";
import { MemberRegisterRequest } from "@/app/api/auth/auth.types";
import { register } from "../../../lib/rest/auth/auth.rest";

export default function SignupForm() {
  // 서버로 보낼 데이터
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

      // 유효성 검사
      if (!form.email) {
        setError("이메일을 입력해주세요.");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        setError("올바른 이메일 형식을 입력해주세요.");
        return;
      }

      if (!form.name) {
        setError("이름을 입력해주세요.");
        return;
      }

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

      if (!form.agreeTerms) {
        setError("서비스 이용약관에 동의해주세요.");
        return;
      }

      setLoading(true);
      try {
        await register(form);
        setSuccess(true);
      } catch {
        setError("회원가입에 실패했습니다. 다시 시도해주세요.");
      } finally {
        setLoading(false);
      }
    },
    [form, passwordConfirm]
  );

  console.log("REGISTER PAYLOAD", JSON.stringify(form));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          회원가입
        </h1>
        <p className="text-text-muted-light dark:text-text-muted-dark">
          FloCut과 함께 문서 분석을 시작하세요
        </p>
      </div>

      {/* Form Card */}
      <div className="p-8 rounded-2xl bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-xl">
        {success ? (
          /* Success Message */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-4"
          >
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mx-auto mb-4">
              <CheckCircle size={32} strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold mb-2">
              인증 메일을 발송했습니다
            </h3>
            <p className="text-text-muted-light dark:text-text-muted-dark mb-1">
              <span className="font-semibold text-accent">{form.email}</span>
            </p>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-6">
              위 주소로 인증 메일을 발송했습니다.
              <br />
              인증을 완료하신 후 로그인을 진행하실 수 있습니다.
            </p>
            <Link href="/login">
              <Button className="w-full">
                로그인 페이지로 이동
              </Button>
            </Link>
          </motion.div>
        ) : (
          /* Registration Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <Input
              label="이메일"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              placeholder="email@example.com"
              required
            />

            {/* Name */}
            <Input
              label="이름"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="홍길동"
              required
            />

            {/* Phone (Optional) */}
            <Input
              label="전화번호 (선택)"
              value={form.tel ?? ""}
              onChange={handleChange("tel")}
              placeholder="010-1234-5678"
            />

            {/* Password */}
            <Input
              label="비밀번호"
              type="password"
              value={form.password}
              onChange={handleChange("password")}
              placeholder="8자 이상 입력"
              required
            />

            {/* Password Confirm */}
            <Input
              label="비밀번호 확인"
              type="password"
              value={passwordConfirm}
              onChange={(e) => {
                setPasswordConfirm(e.target.value);
                setError(null);
              }}
              placeholder="비밀번호 재입력"
              required
            />

            {/* Terms Checkbox */}
            <Checkbox
              label="서비스 이용약관에 동의합니다"
              required
              checked={form.agreeTerms}
              onChange={(checked) =>
                setForm(prev => ({ ...prev, agreeTerms: checked }))
              }
              actionText="약관 보기"
              onActionClick={() => setOpenTermsModal(true)}
            />

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                <p className="text-sm text-red-500 text-center">
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full" loading={loading}>
              회원가입
            </Button>
          </form>
        )}
      </div>

      {/* Footer Links */}
      {!success && (
        <div className="mt-6 text-center">
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
            이미 계정이 있으신가요?{" "}
            <Link
              href="/login"
              className="text-accent hover:text-accent-hover font-medium transition-colors"
            >
              로그인
            </Link>
          </p>
        </div>
      )}

      {/* Terms Modal */}
      {openTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl rounded-2xl bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border-light dark:border-border-dark">
              <h2 className="text-xl font-bold">
                서비스 이용약관
              </h2>
              <button
                onClick={() => setOpenTermsModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent/10 text-text-muted-light dark:text-text-muted-dark hover:text-accent transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="text-sm text-text-muted-light dark:text-text-muted-dark leading-relaxed space-y-4">
                <p>
                  여기에 서비스 이용약관 내용이 들어갑니다.
                  실제 서비스에서는 법적으로 유효한 약관을 작성해야 합니다.
                </p>
                <p>
                  제1조 (목적)
                  <br />
                  본 약관은 FloCut이 제공하는 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
                </p>
                <p>
                  제2조 (정의)
                  <br />
                  1. "서비스"란 구현되는 단말기(PC, TV, 휴대형 단말기 등의 각종 유무선 장치를 포함)와 상관없이 "회원"이 이용할 수 있는 FloCut 관련 제반 서비스를 의미합니다.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border-light dark:border-border-dark">
              <Button
                type="button"
                className="w-full"
                onClick={() => setOpenTermsModal(false)}
              >
                확인
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}