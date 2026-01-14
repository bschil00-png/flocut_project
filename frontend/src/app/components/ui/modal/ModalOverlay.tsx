"use client";

type Props = {
    onClose?: () => void;
};

export default function ModalOverlay({ onClose }: Props) {
    return (
        <div
            onClick={onClose}
            className="
        fixed inset-0 z-40
        bg-black/30
        backdrop-blur-[2px]
      "
        />
    );
}
