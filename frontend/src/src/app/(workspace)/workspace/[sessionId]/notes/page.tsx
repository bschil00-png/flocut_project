"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NotesRedirect() {
  const router = useRouter();
  const { sessionId } = useParams<{ sessionId: string }>();

  useEffect(() => {
    router.replace(`/workspace/${sessionId}`);
  }, [sessionId, router]);

  return null;
}