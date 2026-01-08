"use client";
import { useEffect, useState } from "react";

export default function useResponsiveNav() {
  const [isCollapsed, setCollapsed] = useState(false);
  const [isMobile, setMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;

      if (width < 768) {
        setMobile(true);
        setCollapsed(true);
      } else if (width < 1280) {
        setMobile(false);
        setCollapsed(true);
      } else {
        setMobile(false);
        setCollapsed(false);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isCollapsed, isMobile, setCollapsed };
}
