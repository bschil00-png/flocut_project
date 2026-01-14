"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import AvatarSelector from "@/app/components/settings/AvatarSelector";
import Button from "@/app/components/ui/button/Button";
import FormField from "@/app/components/ui/form/FormField";
import Input from "@/app/components/ui/input/Input";
import Divider from "@/app/components/ui/divider/Divider";
import AlertDialog from "@/app/components/ui/modal/AlertDialog";

import { RootState } from "@/store";
import { useAuthState } from "@/hooks/useAuthState";
import { setAvatarId } from "@/store/slice/uislice";
import { useProfileActions } from "@/hooks/member/useProfileActions";

export default function ProfilePanel() {
    const dispatch = useDispatch();
    const { user } = useAuthState();
    const { updateProfile } = useProfileActions();

    const currentAvatarId = useSelector(
        (state: RootState) => state.ui.avatarId
    );

    const [avatarId, setLocalAvatarId] = useState(currentAvatarId);
    const [name, setName] = useState("");
    const [tel, setTel] = useState("");
    const [loading, setLoading] = useState(false);

    //  Alert 상태
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    useEffect(() => {
        if (!user) return;
        setName(user.name);
        setTel(user.tel);
    }, [user]);

    useEffect(() => {
        setLocalAvatarId(currentAvatarId);
    }, [currentAvatarId]);

    const handleSave = async () => {
        if (!user || !name.trim() || !tel.trim()) return;

        const isChanged =
            name !== user.name ||
            tel !== user.tel ||
            avatarId !== currentAvatarId;


        if (!isChanged) {
            setAlertMessage("변경사항이 없습니다.");
            setAlertOpen(true);
            return;
        }

        setLoading(true);
        try {
            dispatch(setAvatarId(avatarId));
            await updateProfile({ name, tel, profileImage: avatarId });

            setAlertMessage("회원 정보가 성공적으로 저장되었습니다.");
        } catch {
            setAlertMessage("회원 정보 수정에 실패했습니다.");
        } finally {
            setLoading(false);
            setAlertOpen(true);
        }
    };

    if (!user) return null;

    return (
        <>
            <div className="max-w-2xl space-y-6">
                <div>
                    <h2 className="text-lg font-bold">프로필 설정</h2>
                    <p className="text-sm text-text-muted-light mt-1">
                        프로필 정보를 관리합니다.
                    </p>
                </div>

                <AvatarSelector
                    currentAvatarId={avatarId}
                    userName={name}
                    onChange={setLocalAvatarId}
                />

                <Divider />

                <div className="space-y-3">
                    <FormField label="이름">
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </FormField>

                    <FormField label="이메일">
                        <Input value={user.email} disabled />
                    </FormField>

                    <FormField label="전화번호">
                        <Input value={tel} onChange={(e) => setTel(e.target.value)} />
                    </FormField>
                </div>

                <div className="flex justify-end pt-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        loading={loading}
                        onClick={handleSave}
                    >
                        저장
                    </Button>
                </div>
            </div>

            {/*  AlertDialog만 사용 */}
            <AlertDialog
                open={alertOpen}
                title="알림"
                message={alertMessage}
                onClose={() => setAlertOpen(false)}
            />
        </>
    );
}
