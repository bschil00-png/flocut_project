"use client";

import { useState } from "react";
import Card from "@/app/components/ui/card/Card";
import Input from "@/app/components/ui/input/Input";
import Button from "@/app/components/ui/button/Button";
import { useAuthState } from "@/hooks/useAuthState";
import { useProfileActions } from "@/hooks/useProfileActions";

export default function ProfilePanel() {
    const { user } = useAuthState();
    const { updateProfile } = useProfileActions();

    const [name, setName] = useState(user?.name ?? "");
    const [tel, setTel] = useState("");

    if (!user) return null;

    async function handleSubmit() {
        await updateProfile({ name, tel });
    }

    return (
        <div className="space-y-6 max-w-xl">
            <Card>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-semibold">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs text-text-muted-light">
                            {user.email}
                        </p>
                    </div>
                </div>
            </Card>

            <Card>
                <h3 className="text-sm font-semibold mb-4">내 정보 수정</h3>

                <div className="space-y-4">
                    <Input
                        label="이름"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <Input
                        label="전화번호"
                        value={tel}
                        onChange={(e) => setTel(e.target.value)}
                    />

                    <Button onClick={handleSubmit}>
                        저장
                    </Button>
                </div>
            </Card>
        </div>
    );
}
