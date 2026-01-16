"use client";

import React from "react";
import Button from "./Button";

type ToolbarButtonSize = "sm" | "md";

interface ToolbarButtonProps {
  icon: React.ReactNode;
  label?: string;
  active?: boolean;
  disabled?: boolean;
  size?: ToolbarButtonSize;
  onClick: () => void;
  className?: string;
}


  // 에디터 툴바 전용 버튼 컴포넌트
 
  //  에디터 컨트롤 용도로만 사용
  //  variant, size를 제한

export default function ToolbarButton({
                                        icon,
                                        label,
                                        active = false,
                                        disabled = false,
                                        size = "sm",
                                        onClick,
                                        className = "",
                                      }: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size={size === "sm" ? "sm" : "md"}
      disabled={disabled}
      onClick={onClick}
      className={`
        px-2
        ${active ? "bg-accent-soft text-accent" : ""}
        ${className}
      `}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label && (
          <span className="hidden sm:inline text-sm whitespace-nowrap">
            {label}
          </span>
        )}
      </span>
    </Button>
  );
}
