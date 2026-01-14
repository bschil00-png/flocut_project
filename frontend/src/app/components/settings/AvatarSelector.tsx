"use client";

import { useState } from "react";
import { Check } from "lucide-react";

const AVATAR_STYLES = [
    { id: "gradient-1", name: "핑크", class: "from-pink-500 to-violet-500" },
    { id: "gradient-2", name: "블루", class: "from-blue-500 to-cyan-500" },
    { id: "gradient-3", name: "그린", class: "from-green-500 to-teal-500" },
    { id: "gradient-4", name: "오렌지", class: "from-orange-500 to-red-500" },
    { id: "gradient-5", name: "퍼플", class: "from-purple-500 to-pink-500" },
    { id: "gradient-6", name: "인디고", class: "from-indigo-500 to-purple-500" },
];

type Props = {
    currentAvatarId: string;
    userName: string;
    onChange: (avatarId: string) => void;
};

export default function AvatarSelector({
                                           currentAvatarId,
                                           userName,
                                           onChange,
                                       }: Props) {
    const [selected, setSelected] = useState(currentAvatarId);
    const initial = userName?.charAt(0).toUpperCase() || "U";

    const handleSelect = (avatarId: string) => {
        setSelected(avatarId);
        onChange(avatarId);
    };

    return (
        <div className="space-y-4">
            {/* 현재 아바타 미리보기 */}
            <div className="flex items-center gap-4">
                <AvatarPreview avatarId={selected} initial={initial} size="sm" />
                <div>
                    <p className="text-sm font-medium">현재 프로필 이미지</p>
                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                        프로필 스타일을 선택할 수 있습니다.
                    </p>
                </div>
            </div>

            {/* 아바타 선택 */}
            <div>
                <label className="block text-sm font-medium mb-2">
                    프로필 스타일 선택
                </label>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {AVATAR_STYLES.map((style) => (
                        <button
                            key={style.id}
                            onClick={() => handleSelect(style.id)}
                            className={`
                                relative aspect-square rounded-lg
                                border transition-all
                                ${
                                selected === style.id
                                    ? "border-accent ring-2 ring-accent/30"
                                    : "border-border-light dark:border-border-dark hover:border-accent/50"
                            }
                            `}
                        >
                            <AvatarPreview
                                avatarId={style.id}
                                initial={initial}
                                size="xs"
                            />

                            {selected === style.id && (
                                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                                    <Check size={10} className="text-white" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function AvatarPreview({
                           avatarId,
                           initial,
                           size,
                       }: {
    avatarId: string;
    initial: string;
    size: "xs" | "sm";
}) {
    const sizes = {
        xs: "w-full h-full text-sm",
        sm: "w-14 h-14 text-xl",
    };

    const style =
        AVATAR_STYLES.find((s) => s.id === avatarId) || AVATAR_STYLES[0];

    return (
        <div
            className={`
                ${sizes[size]}
                rounded-lg
                bg-gradient-to-br ${style.class}
                text-white font-bold
                flex items-center justify-center
            `}
        >
            {initial}
        </div>
    );
}

export { AVATAR_STYLES };
export function getAvatarStyle(avatarId: string) {
    return AVATAR_STYLES.find((s) => s.id === avatarId) || AVATAR_STYLES[0];
}