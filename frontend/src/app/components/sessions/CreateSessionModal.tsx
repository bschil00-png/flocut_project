"use client";

import { useState } from "react";
import ActionModal from "@/app/components/ui/modal/ActionModal";
import Input from "@/app/components/ui/input/Input";
import Button from "@/app/components/ui/button/Button";
import { createSession } from "@/lib/rest/session/session.rest";
import { useSessions } from "@/hooks/sessions/useSessions";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CreateSessionModal({ open, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const { refetch } = useSessions();

  const handleCreate = async () => {
    if (!title.trim()) return;

    try {
      setLoading(true);

      await createSession({
        sessionTitle: title,
      });

      await refetch();

      setTitle("");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <ActionModal
      open={open}
      onClose={onClose}
      title="새 세션 만들기"
      size="sm"
    >
      <Input
        label="세션 이름"
        placeholder="예: 3월 마케팅 회의"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onClose}>
          취소
        </Button>
        <Button loading={loading} onClick={handleCreate}>
          생성
        </Button>
      </div>
    </ActionModal>
  );
}