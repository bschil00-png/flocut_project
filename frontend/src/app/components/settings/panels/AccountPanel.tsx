"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import Button from "@/app/components/ui/button/Button";
import FormField from "@/app/components/ui/form/FormField";
import Input from "@/app/components/ui/input/Input";
import Divider from "@/app/components/ui/divider/Divider";
import Card from "@/app/components/ui/card/Card";
import { RootState } from "@/store";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";
import { changePassword } from "@/lib/rest/auth/auth.rest";

export default function AccountPanel() {
    const user = useSelector((state: RootState) => state.auth.user);

    // 입력 상태
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // UI 제어 상태
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // 비밀번호 표시/숨김
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    const handlePasswordChange = async () => {
        setError(null);
        setSuccess(null);

        // 비밀번호 유효성 검사
        const passwordError = validatePassword(newPassword);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        // 비밀번호 일치 확인
        if (newPassword !== confirmPassword) {
            setError("새 비밀번호가 일치하지 않습니다.");
            return;
        }

        // 현재 비밀번호와 동일한지 확인
        if (currentPassword === newPassword) {
            setError("현재 비밀번호와 동일한 비밀번호는 사용할 수 없습니다.");
            return;
        }

        setLoading(true);
        try {
            // API 호출 - 백엔드 /auth/password/change 엔드포인트 호출
            // 현재 비밀번호와 새 비밀번호를 전달하여 변경
            await changePassword(currentPassword, newPassword);

            // 성공 메시지 표시
            setSuccess("비밀번호가 성공적으로 변경되었습니다.");

            // 입력 필드 초기화
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            // 3초 후 성공 메시지 자동 제거
            setTimeout(() => {
                setSuccess(null);
            }, 3000);
        } catch (err: any) {
            // 에러 처리
            // 백엔드에서 "현재 비밀번호가 일치하지 않습니다" 등의 에러 반환
            const errorMessage = err?.response?.data?.message ||
                err?.message ||
                "비밀번호 변경에 실패했습니다. 다시 시도해주세요.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = () => {
        if (confirm("정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
            // TODO: 회원 탈퇴 API 연결
            console.log("회원 탈퇴");
        }
    };

    return (
        <div className="max-w-2xl space-y-8">
            <div>
                <h2 className="text-xl font-bold">계정 설정</h2>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">
                    비밀번호 변경 및 계정 관리
                </p>
            </div>

            <Divider />

            {/* 비밀번호 변경 */}
            <div className="space-y-4">
                <h3 className="text-base font-semibold">비밀번호 변경</h3>

                {/* Success Message */}
                {success && (
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                        <p className="text-sm text-green-600 dark:text-green-400">
                            {success}
                        </p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                        <p className="text-sm text-red-500">
                            {error}
                        </p>
                    </div>
                )}

                <FormField label="현재 비밀번호" htmlFor="current-password">
                    <div className="relative">
                        <Input
                            id="current-password"
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => {
                                setCurrentPassword(e.target.value);
                                setError(null);
                                setSuccess(null);
                            }}
                            placeholder="현재 비밀번호"
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark hover:text-accent transition-colors"
                        >
                            {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </FormField>

                <FormField label="새 비밀번호" htmlFor="new-password">
                    <div className="relative">
                        <Input
                            id="new-password"
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                setError(null);
                                setSuccess(null);
                            }}
                            placeholder="새 비밀번호 (8자 이상, 영문+숫자)"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark hover:text-accent transition-colors"
                        >
                            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </FormField>

                <FormField label="새 비밀번호 확인" htmlFor="confirm-password">
                    <div className="relative">
                        <Input
                            id="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setError(null);
                                setSuccess(null);
                            }}
                            placeholder="새 비밀번호 확인"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark hover:text-accent transition-colors"
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </FormField>

                {/* Info Message */}
                <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                    <div className="text-xs text-text-muted-light dark:text-text-muted-dark space-y-1">
                        <p>비밀번호는 8자 이상이어야 합니다.</p>
                        <p>영문과 숫자를 포함해야 합니다.</p>
                        <p>현재 비밀번호와 동일할 수 없습니다.</p>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button
                        onClick={handlePasswordChange}
                        loading={loading}
                        disabled={!currentPassword || !newPassword || !confirmPassword}
                    >
                        비밀번호 변경
                    </Button>
                </div>
            </div>

            <Divider />

            {/* 계정 삭제 */}
            <div>
                <h3 className="text-base font-semibold mb-4">계정 삭제</h3>

                <Card variant="outlined" className="border-red-200 dark:border-red-900/30 p-4">
                    <div className="flex items-start gap-3">
                        <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 space-y-3">
                            <div>
                                <h4 className="font-semibold text-red-600 dark:text-red-400 mb-1">
                                    회원 탈퇴
                                </h4>
                                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                                    계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
                                </p>
                            </div>

                            <Button
                                variant="secondary"
                                onClick={handleDeleteAccount}
                                className="text-red-600 dark:text-red-400"
                            >
                                회원 탈퇴
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}