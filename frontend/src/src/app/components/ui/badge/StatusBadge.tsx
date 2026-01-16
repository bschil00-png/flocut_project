"use client";

type MemberStatus = "READY" | "ACTIVE" | "DISABLED" | "DELETED";

type StatusBadgeProps = {
    status: MemberStatus;
};

const statusStyle: Record<MemberStatus, string> = {
    READY: `
    bg-gray-100 text-gray-700
    dark:bg-gray-700 dark:text-gray-200
  `,
    ACTIVE: `
    bg-green-100 text-green-700
    dark:bg-green-900/30 dark:text-green-300
  `,
    DISABLED: `
    bg-yellow-100 text-yellow-700
    dark:bg-yellow-900/30 dark:text-yellow-300
  `,
    DELETED: `
    bg-red-100 text-red-700
    dark:bg-red-900/30 dark:text-red-300
  `,
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    return (
        <span
            className={`
        inline-flex items-center
        px-2.5 py-0.5
        rounded-full
        text-xs font-medium
        ${statusStyle[status]}
      `}
        >
      {status}
    </span>
    );
}
