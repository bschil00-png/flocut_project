"use client";

type CardVariant = "default" | "outlined" | "ghost";
type CardPadding = "none" | "sm" | "md" | "lg";

type CardProps = {
    children: React.ReactNode;
    className?: string;
    variant?: CardVariant;
    padding?: CardPadding;
    interactive?: boolean;
    onClick?: () => void;
};

export default function Card({
                                 children,
                                 className = "",
                                 variant = "default",
                                 padding = "md",
                                 interactive = false,
                                 onClick,
                             }: CardProps) {
    const base = `
    rounded-xl
    transition-colors
  `;

    const variants = {
        default: `
      border border-border-light
      dark:border-border-dark
      bg-background-light
      dark:bg-surface-dark
    `,
        outlined: `
      border border-border-light
      dark:border-border-dark
      bg-transparent
    `,
        ghost: `
      bg-transparent
    `,
    };

    const paddings = {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
    };

    const interactiveStyle = interactive
        ? `
    cursor-pointer
    transition-all
    hover:shadow-md
  `
        : "";

    return (
        <div
            className={`${base} ${variants[variant]} ${paddings[padding]} ${interactiveStyle} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}