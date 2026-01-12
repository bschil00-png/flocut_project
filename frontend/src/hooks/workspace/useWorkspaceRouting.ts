"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";

export function useWorkspaceRouting() {
  const router = useRouter();
  const params = useParams<{ sessionId: string }>();
  const searchParams = useSearchParams();

  const selectedId = searchParams.get("id");
  const selectedType = searchParams.get("type") as
    | "note"
    | "document"
    | "audio"
    | null;

  const openItem = (type: string, id: number | string) => {
    router.push(
      `/workspace/${params.sessionId}?type=${type}&id=${id}`,
      { scroll: false }
    );
  };

  const openNewNote = () => {
    openItem("note", "new");
  };

  const closePanel = () => {
    router.push(`/workspace/${params.sessionId}`, { scroll: false });
  };

  return {
    selectedId,
    selectedType,
    openItem,
    openNewNote,
    closePanel,
  };
}
