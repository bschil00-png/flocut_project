"use client";

import Card from "@/app/components/ui/card/Card";
import Button from "@/app/components/ui/button/Button";
import { useProfileActions } from "@/hooks/useProfileActions";
import { useRouter } from "next/navigation";

export default function AccountPanel() {
    const { deleteAccount } = useProfileActions();
    const router = useRouter();

    async function handleDelete() {
        const ok = window.confirm(
            "정말로 회원 탈퇴하시겠습니까?\n모든 데이터가 영구적으로 삭제됩니다."
        );

        if (!ok) return;

        try {
            await deleteAccount();
            alert("회원 탈퇴가 완료되었습니다.");
            router.push("/login");
        } catch (e) {
            alert("회원 탈퇴 중 오류가 발생했습니다.");
        }
    }

    return (
        <div className="space-y-6 max-w-xl">
            <Card>
                <h3 className="text-sm font-semibold text-red-600 mb-4">
                    계정 삭제
                </h3>

                <p className="text-xs text-text-muted-light mb-4">
                    계정을 삭제하면 모든 데이터가 영구적으로 제거됩니다.
                </p>

                <Button
                    variant="ghost"
                    className="text-red-600 hover:bg-red-500/10"
                    onClick={handleDelete}
                >
                    회원 탈퇴
                </Button>
            </Card>
        </div>
    );
}
