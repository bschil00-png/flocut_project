"use client";

import ActionModal from "@/app/components/ui/modal/ActionModal";
import Form from "@/app/components/ui/form/Form";
import FormField from "@/app/components/ui/form/FormField";
import Input from "@/app/components/ui/input/Input";
import Button from "@/app/components/ui/button/Button";
import { useState } from "react";
import { updateSession } from "@/lib/rest/session/session.rest";

type SessionEditModalProps = {
  open: boolean;
  onClose: () => void;
  sessionId: number;
  initialTitle: string;
  initialDescription?: string | null;
  onUpdated: () => void;
};

export default function SessionEditModal({
                                           open,
                                           onClose,
                                           sessionId,
                                           initialTitle,
                                           initialDescription,
                                           onUpdated,
                                         }: SessionEditModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription ?? "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    try {
      await updateSession(sessionId, {
        sessionTitle: title,
        description,
      });

      onUpdated();
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <ActionModal
      open={open}
      onClose={onClose}
      title="세션 수정"
      size="md"
    >
      <Form onSubmit={handleSubmit}>
        <FormField label="세션 이름" htmlFor="sessionTitle">
          <Input
            id="sessionTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="세션 이름을 입력하세요"
            required
          />
        </FormField>

        <FormField label="설명">
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="설명 (선택)"
          />
        </FormField>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            취소
          </Button>

          <Button
            type="submit"
            loading={loading}
          >
            저장
          </Button>
        </div>
      </Form>
    </ActionModal>
  );
}