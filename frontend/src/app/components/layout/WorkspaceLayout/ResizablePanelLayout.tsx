"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
    isOpen: boolean;
    left: (compact: boolean) => React.ReactNode;
    right: React.ReactNode;
    initialWidth?: number;
};

export default function ResizablePanelLayout({
                                                 isOpen,
                                                 left,
                                                 right,
                                                 initialWidth = 600,
                                             }: Props) {
    const [panelWidth, setPanelWidth] = useState(initialWidth);
    const [isCompact, setIsCompact] = useState(false);

    const isDraggingRef = useRef(false);
    const isFullWhileDraggingRef = useRef(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDraggingRef.current) return;

            const vw = window.innerWidth;
            const newPanelWidth = vw - e.clientX;

            const minPanel = 360;
            const maxPanel = vw * 0.85;

            const clamped = Math.max(
                minPanel,
                Math.min(maxPanel, newPanelWidth)
            );

            setPanelWidth(clamped);

            const leftWidth = vw - clamped;
            const leftRatio = leftWidth / vw;

            //  compact 판단 (리스트 UI용)
            setIsCompact(leftRatio <= 0.3);

            //  전체 패널은 "드래그 중일 때만"
            isFullWhileDraggingRef.current = leftRatio <= 0.3;
        };

        const handleMouseUp = () => {
            isDraggingRef.current = false;
            isFullWhileDraggingRef.current = false;

            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    const showFullPanel =
        isOpen &&
        isDraggingRef.current &&
        isFullWhileDraggingRef.current;

    // 드래그 중 + 30% 이하일 때만 전체
    if (showFullPanel) {
        return (
            <div className="h-full w-full overflow-hidden">
                {right}
            </div>
        );
    }

    return (
        <div className="h-full flex min-h-0">
            {/* LEFT */}
            <div
                className="flex flex-col min-h-0 overflow-hidden transition-all duration-200"
                style={{
                    width: isOpen
                        ? `calc(100% - ${panelWidth}px)`
                        : "100%",
                }}
            >
                {left(isCompact)}
            </div>

            {/* RIGHT */}
            {isOpen && (
                <>
                    {/* RESIZER */}
                    <div
                        onMouseDown={() => {
                            isDraggingRef.current = true;
                            document.body.style.cursor = "ew-resize";
                            document.body.style.userSelect = "none";
                        }}
                        className="w-1 cursor-ew-resize bg-border-light hover:bg-accent"
                    />

                    {/* PANEL */}
                    <div
                        className="flex flex-col min-h-0 border-l border-border-light bg-white"
                        style={{ width: panelWidth }}
                    >
                        {right}
                    </div>
                </>
            )}
        </div>
    );
}
