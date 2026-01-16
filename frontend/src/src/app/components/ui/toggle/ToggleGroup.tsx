"use client";

type Option = {
  value: string;
  label: string;
  icon?: React.ReactNode;
};

type Props = {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  size?: "sm" | "md";
  className?: string;
};

export default function ToggleGroup({
                                      value,
                                      options,
                                      onChange,
                                      size = "md",
                                      className = "",
                                    }: Props) {


  const sizes = {
    sm: "h-8 px-2.5 text-xs",
    md: "h-9 px-3 text-sm",
  };

  return (
    <div
      className={`
        inline-flex gap-1 p-1
        rounded-lg border border-border-light dark:border-border-dark
        bg-surface-light dark:bg-surface-dark
        ${className}
      `}
    >
      {options.map((option) => {
        const isActive = value === option.value;

        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              flex items-center justify-center gap-1.5
              ${sizes[size]}
              rounded-md font-medium
              transition-all duration-200
              ${
              isActive
                ? "bg-white dark:bg-surface-hover text-accent shadow-sm"
                : "text-text-muted-light dark:text-text-muted-dark hover:text-text-primary-light dark:hover:text-text-primary-dark hover:bg-white/50 dark:hover:bg-surface-hover/50"
            }
            `}
          >
            {option.icon}
            <span className="hidden sm:inline">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}