"use client";

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

                text-text-primary-light dark:text-white

                hover:bg-accent-soft dark:hover:bg-accent-soft

                focus:outline-none focus-visible:ring-2 focus-visible:ring-accent
                transition-colors

                ${className}
            `}
      {...props}
    >
      {icon}
    </button>
  );
}
