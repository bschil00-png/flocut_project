"use client";

import { useDispatch, useSelector } from "react-redux";
import { toggleChat } from "@/store/slice/uislice";
import { RootState } from "@/store";
import CharacterAvatar from "./CharacterAvatar";

export default function FloatingChatButton() {
  const dispatch = useDispatch();
  const chatOpen = useSelector((state: RootState) => state.ui.chatOpen);

  return (
    <button
      onClick={() => dispatch(toggleChat())}
      aria-label="FloCut AI"
      className={`
                fixed bottom-6 right-6 z-[65]
                w-16 h-16
                flex items-center justify-center
                bg-transparent
                transition-all duration-300
                hover:scale-105 active:scale-95
                ${chatOpen ? "opacity-0 pointer-events-none" : "opacity-100"}
            `}
    >
      <CharacterAvatar />
    </button>
  );
}