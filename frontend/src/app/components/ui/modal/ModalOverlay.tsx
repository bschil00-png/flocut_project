"use client";

type ModalOverlayProps = {
    onClose: () => void;
};

export default function ModalOverlay({ onClose }: ModalOverlayProps) {
    return (
        <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
        />
    );
}
