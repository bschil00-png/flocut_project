"use client"

// FormField는 Form이 하기엔 너무 구체적이고,
// Input이 하기엔 너무 추상적인 책임을 맡기기 위해 생성해둠

type FormFieldProps = {
    label?: string;
    error?: string;
    helperText?: string;
    children: React.ReactNode;
    // input id 연결용
    htmlFor?: string;
    className?: string;
};

export default function FormField({label, error, helperText, children, className = "", htmlFor}: FormFieldProps) {
    return (
        //  form
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label
                    htmlFor={htmlFor}
                    className="text-sm font-medium text-text-primary-light dark:text-primary-dark"
                >
                    {label}
                </label>
            )}
            {/*input 영역*/}
            {children}
            {(error || helperText) && (
                <p
                    className={`
            text-xs
            ${error
                        ? "text-red-500"
                        : "text-text-muted-light dark:text-text-muted-dark"}
          `}
                >
                    {/*error가 아예 없을 때만 helperText*/}
                    {error ?? helperText}
                </p>

            )}
        </div>
    )


}