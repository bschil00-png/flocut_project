"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import Button from "@/app/components/ui/button/Button";
import FormField from "@/app/components/ui/form/FormField";
import Input from "@/app/components/ui/input/Input";
import Divider from "@/app/components/ui/divider/Divider";
import Card from "@/app/components/ui/card/Card";
import { RootState } from "@/store";
import { AlertTriangle } from "lucide-react";

export default function AccountPanel() {
    const user = useSelector((state: RootState) => state.auth.user);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            alert("새 비밀번호가 일치하지 않습니다.");
            return;
        }

        setLoading(true);
        try {
            console.log("비밀번호 변경 성공");

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error("비밀번호 변경 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = () => {
        if (confirm("정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
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

                <FormField label="현재 비밀번호" htmlFor="current-password">
                    <Input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="현재 비밀번호"
                    />
                </FormField>

                <FormField label="새 비밀번호" htmlFor="new-password">
                    <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="새 비밀번호 (8자 이상)"
                    />
                </FormField>

                <FormField label="새 비밀번호 확인" htmlFor="confirm-password">
                    <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="새 비밀번호 확인"
                    />
                </FormField>

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