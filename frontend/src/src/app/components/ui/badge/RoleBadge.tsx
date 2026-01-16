"use client";

type Role = "USER" | "ADMIN";

export default function RoleBadge({ role }: { role: Role }) {
    const style =
        role === "ADMIN"
            ? "bg-accent-soft text-accent"
            : "bg-surface-light dark:bg-surface-dark text-text-muted-light";

    return (
        <span
            className={`
        inline-flex items-center
        px-2 py-0.5
        rounded-md
        text-xs font-medium
        ${style}
      `}
        >
      {role}
    </span>
    );
}
