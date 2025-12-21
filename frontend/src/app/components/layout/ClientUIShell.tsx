// ClientUIShell.tsx
"use client";


//  클라이언트 전용
import FloatingChatButton from "@/app/components/chat/FloatingChatButton";
import ChatDrawer from "@/app/components/chat/ChatDrawer";
import Footer from "@/app/components/layout/Footer";
import {useAuthActions} from "@/hooks/useAuthActions";
import {useEffect} from "react";



export default function ClientUIShell({ children }: { children: React.ReactNode }) {
  const auth = useAuthActions();

  // 페이지 동기화
  // 로그인 상태일 떄 저장
  // 비로그인 상태 -> clearAuth
  useEffect(() => {
    auth.sync();
  }, []); // auth.sync는 useCallback으로 안정화됨

  return (
    <>
      {children}
      <FloatingChatButton />
      <ChatDrawer />
      <Footer />
    </>
  );
}
