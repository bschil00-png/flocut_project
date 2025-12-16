"use client"

//아이콘 버튼

export type IconButtonProps = {
    icon: React.ReactNode;
} & Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "children"
>;

export default function IconButton({
                                       icon,
                                       className = "",
                                       type = "button",
                                       ...props
                                   }: IconButtonProps) {
    return (
        <button
            type={type}
            className={`
        inline-flex items-center justify-center
        h-9 w-9 rounded-md
        border border-border-light dark:border-border-dark
        hover:bg-surface-light dark:hover:bg-surface-hover
        focus:outline-none focus-visible:ring-2 focus-visible:ring-accent
        ${className}
      `}
            {...props}
        >
            {icon}
        </button>
    );
}