"use client";

import Button from "@/app/components/ui/button/Button";
import Input from "@/app/components/ui/input/Input";
import { useState } from "react";

interface Props {
    onSend: (text: string) => void;
    disabled?: boolean;
}

export default function InputBar({ onSend, disabled }: Props) {
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim() || disabled) return;
        onSend(input);
        setInput("");
    };

    return (
        <div className="flex items-center gap-2 px-3 py-3 bg-background-light dark:bg-surface-dark">
            <div className="flex-1">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="예: 이 문단을 3줄로 요약해줘"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSend();
                    }}
                    disabled={disabled}
                />
            </div>

            <Button size="md" disabled={disabled} onClick={handleSend}>
                Send
            </Button>
        </div>
    );
}
