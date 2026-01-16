"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import Button from "@/app/components/ui/button/Button";
import FormField from "@/app/components/ui/form/FormField";
import Input from "@/app/components/ui/input/Input";
import Divider from "@/app/components/ui/divider/Divider";
import Card from "@/app/components/ui/card/Card";
import ConfirmDialog from "@/app/components/ui/modal/ConfirmDialog";
import AlertDialog from "@/app/components/ui/modal/AlertDialog";

import { RootState } from "@/store";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";
import { changePassword } from "@/lib/rest/auth/auth.rest";
import { useProfileActions } from "@/hooks/member/useProfileActions";

export default function AccountPanel() {
  const user = useSelector((state: RootState) => state.auth.user);
  const { deleteAccount } = useProfileActions();

  // 입력 상태
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 비밀번호 표시
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 다이얼로그 상태
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  if (!user) return null;

  /* ---------------- 비밀번호 변경 ---------------- */

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) return "비밀번호는 최소 8자 이상이어야 합니다.";
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      return "비밀번호는 영문과 숫자를 포함해야 합니다.";
    }
    return null;
  };

  const handlePasswordChange = async () => {
    setError(null);
    setSuccess(null);

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("현재 비밀번호와 동일한 비밀번호는 사용할 수 없습니다.");
      return;
    }

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);

      setSuccess("비밀번호가 성공적으로 변경되었습니다.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "비밀번호 변경에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- 회원 탈퇴 ---------------- */

  const handleDeleteAccountConfirm = async () => {
    try {
      await deleteAccount(); // 회원 탈퇴 API + 로그아웃
      setAlertMessage("회원 탈퇴가 완료되었습니다.");
    } catch {
      setAlertMessage("회원 탈퇴에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setConfirmOpen(false);
      setAlertOpen(true);
    }
  };

  return (
    <>
      <div className="max-w-2xl space-y-8">
        <div>
          <h2 className="text-xl font-bold">계정 설정</h2>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">
            비밀번호 변경 및 계정 관리
          </p>
        </div>

        <Divider />

        {/* ================= 비밀번호 변경 ================= */}
        <section className="space-y-4">
          <h3 className="text-base font-semibold">비밀번호 변경</h3>

          {success && (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <p className="text-sm text-green-600 dark:text-green-400">
                {success}
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <FormField label="현재 비밀번호">
            <PasswordInput
              value={currentPassword}
              onChange={setCurrentPassword}
              visible={showCurrentPassword}
              onToggle={() =>
                setShowCurrentPassword(!showCurrentPassword)
              }
            />
          </FormField>

          <FormField label="새 비밀번호">
            <PasswordInput
              value={newPassword}
              onChange={setNewPassword}
              visible={showNewPassword}
              onToggle={() => setShowNewPassword(!showNewPassword)}
            />
          </FormField>

          <FormField label="새 비밀번호 확인">
            <PasswordInput
              value={confirmPassword}
              onChange={setConfirmPassword}
              visible={showConfirmPassword}
              onToggle={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            />
          </FormField>

          <div className="flex justify-end">
            <Button
              onClick={handlePasswordChange}
              loading={loading}
              disabled={
                !currentPassword || !newPassword || !confirmPassword
              }
            >
              비밀번호 변경
            </Button>
          </div>
        </section>

        <Divider />

        {/* ================= 회원 탈퇴 ================= */}
        <section>
          <h3 className="text-base font-semibold mb-4">계정 삭제</h3>

          <Card
            variant="outlined"
            className="border-red-200 dark:border-red-900/30 p-4"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle
                size={20}
                className="text-red-500 mt-0.5"
              />
              <div className="flex-1 space-y-3">
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                  계정을 삭제하면 모든 데이터가 영구적으로 삭제되며
                  복구할 수 없습니다.
                </p>

                <Button
                  variant="secondary"
                  className="text-red-600 dark:text-red-400"
                  onClick={() => setConfirmOpen(true)}
                >
                  회원 탈퇴
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </div>

      {/* 탈퇴 확인 */}
      <ConfirmDialog
        open={confirmOpen}
        title="회원 탈퇴"
        message="정말 회원 탈퇴를 진행하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmText="탈퇴하기"
        cancelText="취소"
        confirmVariant="danger"
        onConfirm={handleDeleteAccountConfirm}
        onClose={() => setConfirmOpen(false)}
      />

      {/* 결과 알림 */}
      <AlertDialog
        open={alertOpen}
        title="알림"
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
      />
    </>
  );
}

//  나중에 함수로 빼기(공용으로 쓸 수 있을 듯)
function PasswordInput({
                         value,
                         onChange,
                         visible,
                         onToggle,
                       }: {
  value: string;
  onChange: (v: string) => void;
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted-light hover:text-accent"
      >
        {visible ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}
