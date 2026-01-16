"use client";

type InputProps = {
    label?: string;
    error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({
                                  label,
                                  error,
                                  id,
                                  ...props
                              }: InputProps) {
    return (
        <div className="space-y-1">
            {/* label */}
            {label && (
                <label
                    htmlFor={id}
                    className="
            text-sm
            text-text-muted-light
            dark:text-text-muted-dark
          "
                >
                    {label}
                </label>
            )}

            {/* input */}
            <input
                id={id}
                aria-invalid={!!error}
                {...props}
                className={`
          w-full h-11
          rounded-md

          bg-white
          dark:bg-surface-input

          border
          border-border-light
          dark:border-white/10

          px-3
          text-sm
          leading-normal

          text-text-primary-light
          dark:text-text-primary-dark

          placeholder:text-text-muted-light
          dark:placeholder:text-text-muted-dark

          caret-accent

          transition-colors duration-150 ease-in-out
          focus:outline-none
          focus:ring-2
          focus:ring-accent
          focus:border-accent

          disabled:opacity-50
          disabled:cursor-not-allowed

          ${error ? "border-red-500 focus:ring-red-500 caret-red-500" : ""}
        `}
            />

            {/* error message */}
            {error && (
                <p className="text-xs text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}
