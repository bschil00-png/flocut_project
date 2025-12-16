"use client";

import { useDispatch } from "react-redux";
import { toggleChat } from "@/api/store/slice/uislice";
import CharacterAvatar from "./CharacterAvatar";

/**
 * 우하단 고정 챗봇 버튼
 * - 어디서든 표시
 * - 클릭 시 채팅창 토글
 */
export default function FloatingChatButton() {
  const dispatch = useDispatch();

  return (
    <button
      onClick={() => dispatch(toggleChat())}
      className="
        fixed bottom-6 right-6 z-50
        w-16 h-16
        rounded-full
        bg-white
        shadow-lg
        flex items-center justify-center
        hover:scale-105 transition
      "
    >
      <CharacterAvatar />
    </button>
  );
}
