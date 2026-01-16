"use client";

import Modal from "@/app/components/ui/modal/Modal";
import RecordChunkList from "./RecordChunkList";

interface Props {
  open: boolean;
  onClose: () => void;
  sessionId: number;
  onInsertText?: (text: string) => void; // 추가
}

export default function RecordChunkListModal({
                                               open,
                                               onClose,
                                               sessionId,
                                               onInsertText
                                             }: Props) {
  return (
    <Modal
      open={open}
      onCloseAction={onClose}
      title="음성 녹음 기록"
      size="lg"
    >
      <RecordChunkList
        sessionId={sessionId}
        onInsertText={onInsertText}
      />
    </Modal>
  );
}