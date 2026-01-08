"use client";

import { useDispatch } from "react-redux";
import { toggleChat } from "@/store/slice/uislice";
import CharacterAvatar from "./CharacterAvatar";

export default function FloatingChatButton() {
    const dispatch = useDispatch();

    return (
        <button
            onClick={() => dispatch(toggleChat())}
            aria-label=" FloCut AI "
            className="
        fixed bottom-6 right-6 z-50
        flex items-center justify-center
        bg-transparent
        w-16 h-16
        transition-transform duration-200
        hover:scale-105
        active:scale-95
      "
        >
            <CharacterAvatar />
        </button>
    );
}
