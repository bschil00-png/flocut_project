"use client";

import ActionModal from "@/app/components/ui/modal/ActionModal";
import Button from "@/app/components/ui/button/Button";
import { deleteSession } from "@/lib/rest/session/session.rest";
import { useRouter, usePathname } from "next/navigation";

type Props = {
  open: boolean;
  onClose: () => void;
  sessionId: number;
  sessionTitle: string;
  onDeleted: () => void;
};

export default function SessionDeleteModal({
                                             open,
                                             onClose,
                                             sessionId,
                                             sessionTitle,
                                             onDeleted,
                                           }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleDelete() {
    await deleteSession(sessionId);

    onDeleted();

    if (pathname.startsWith(`/workspace/${sessionId}`)) {
      router.replace("/workspace");
    }

    onClose();
  }

  return (
    <ActionModal open={open} onClose={onClose} title="세션 삭제">
      <p className="text-sm">
        '{sessionTitle}' 세션을 삭제하시겠습니까?
      </p>

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          취소
        </Button>
        <Button variant="primary" onClick={handleDelete}>
          삭제
        </Button>
      </div>
    </ActionModal>
  );
}