"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  isOpen: boolean;
  left: React.ReactNode;
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
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const newWidth = window.innerWidth - e.clientX;
      const maxWidth = window.innerWidth * 0.8;

      setPanelWidth(Math.max(400, Math.min(maxWidth, newWidth)));
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
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

  return (
    <div className="h-full flex relative min-h-0">
      {/* LEFT */}
      <div
        className="flex flex-col flex-1 min-h-0"
        style={{
          width: isOpen ? `calc(100% - ${panelWidth}px)` : "100%",
        }}
      >
        {left}
      </div>

      {/* RIGHT */}
      {isOpen && (
        <>
          {/* RESIZER */}
          <div
            onMouseDown={() => (isDraggingRef.current = true)}
            className="hidden lg:block w-1 cursor-ew-resize hover:bg-accent"
          />

          <div
            className="flex flex-col min-h-0 border-l bg-white dark:bg-surface-dark"
            style={{ width: panelWidth }}
          >
            {right}
          </div>
        </>
      )}
    </div>
  );
}
