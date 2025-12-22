"use client";

import { useEffect, useState } from "react";

export default function CharacterAvatar() {
  const [isBlink, setIsBlink] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // 1초간 눈 감기
      setIsBlink(true);
      setTimeout(() => setIsBlink(false), 150); // 150ms → 실제 눈 깜박이는 시간
    }, 4000); // 4초마다 깜박임

    return () => clearInterval(interval);
  }, []);

  return (
    <img
      src={isBlink ? "/bot_close.png" : "/bot_open.png"}
      alt="chatbot avatar"
      className="w-48 h-auto transition-all duration-150"
    />
  );
}
