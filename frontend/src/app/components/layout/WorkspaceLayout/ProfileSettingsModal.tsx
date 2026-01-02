"use client";

import Modal from "@/app/components/ui/modal/Modal";
import Card from "@/app/components/ui/card/Card";
import Button from "@/app/components/ui/button/Button";
import Divider from "@/app/components/ui/divider/Divider";
import { Settings, LogOut, User } from "lucide-react";

type ProfileSettingsModalProps = {
    open: boolean;
    onCloseAction: () => void;
};

export default function ProfileSettingsModal({
                                                 open,
                                                 onCloseAction,
                                             }: ProfileSettingsModalProps) {
    return (
        <Modal
            open={open}
            onCloseAction={onCloseAction}
            title="프로필 & 설정"
            size="md"
        >
            <div className="space-y-6">
                {/* 프로필 요약 */}
                <Card variant="outlined" padding="sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-semibold">
                            F
                        </div>

                        <div className="min-w-0">
                            <p className="text-sm font-medium truncate">
                                사용자 이름
                            </p>
                            <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                                user@email.com
                            </p>
                        </div>
                    </div>
                </Card>

                {/* 설정 메뉴 */}
                <div className="space-y-1">
                    <button
                        className="
              w-full flex items-center gap-3
              px-3 py-2 rounded-md
              text-sm
              hover:bg-accent-soft
              transition
            "
                    >
                        <User size={16} />
                        내 정보 관리
                    </button>

                    <button
                        className="
              w-full flex items-center gap-3
              px-3 py-2 rounded-md
              text-sm
              hover:bg-accent-soft
              transition
            "
                    >
                        <Settings size={16} />
                        설정
                    </button>
                </div>

                <Divider />

                {/* 로그아웃 */}
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:bg-red-500/10"
                >
                    <LogOut size={16} />
                    로그아웃
                </Button>
            </div>
        </Modal>
    );
}
