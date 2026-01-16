"use client";

export default function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="
                inline-flex items-center
                px-2 py-0.5 rounded
                bg-accent-soft
                text-accent text-xs font-medium
            "
    >
            {children}
        </span>
  );
}
