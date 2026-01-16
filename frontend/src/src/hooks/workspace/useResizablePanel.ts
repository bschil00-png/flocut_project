"use client";

import { useEffect, useRef, useState } from "react";

export function useResizablePanel(initialWidth = 600) {
  const [width, setWidth] = useState(initialWidth);
  const draggingRef = useRef(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      const max = window.innerWidth * 0.8;
      setWidth(Math.max(400, Math.min(max, window.innerWidth - e.clientX)));
    };

    const onUp = () => (draggingRef.current = false);

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, []);

  return {
    width,
    startResize: () => (draggingRef.current = true),
  };
}
