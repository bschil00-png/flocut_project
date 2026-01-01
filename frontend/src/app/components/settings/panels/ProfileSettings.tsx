"use client";

import Card from "@/app/components/ui/card/Card";
import Button from "@/app/components/ui/button/Button";
import { useAuthState } from "@/hooks/useAuthState";
import { useProfileActions } from "@/hooks/useProfileActions";
import { useState } from "react";

export default function ProfileSettings() {
    const { user } = useAuthState();
    const { updateProfile } = useProfileActions();

    const [name, setName] = useState(user?.name ?? "");
    const [tel, setTel] = useState("");

    if (!user) return null;

    async function submit() {
        await updateProfile({ name, tel });
    }

    return (
        <div className="flex-1 p-6 overflow-y-auto">
            <Card>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-semibold">
                        {user.name.charAt(0)}
                    </div>

                    <div>
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs text-text-muted-light">{user.email}</p>
                    </div>
                </div>
            </Card>

            <Card className="mt-6 space-y-4">
                <h2 className="text-sm font-semibold">내 정보 수정</h2>

                <div>
                    <label className="text-xs">이름</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input"
                    />
                </div>

                <div>
                    <label className="text-xs">전화번호</label>
                    <input
                        value={tel}
                        onChange={(e) => setTel(e.target.value)}
                        className="input"
                    />
                </div>

                <Button onClick={submit}>저장</Button>
            </Card>
        </div>
    );
}
