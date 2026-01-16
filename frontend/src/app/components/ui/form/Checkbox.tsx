
type CheckboxProps = {
  label?: string;  //  optional로 변경
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  actionText?: string;
  onActionClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function Checkbox({
                                   label,
                                   checked,
                                   onChange,
                                   error,
                                   helperText,
                                   required = false,
                                   actionText,
                                   onActionClick,
                                   disabled = false,
                                   className = ""
                                 }: CheckboxProps) {

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label
        className={`
          flex items-start gap-2 cursor-pointer
          ${disabled ? "cursor-not-allowed opacity-60" : ""}
        `}
      >
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />

        <span
          className={`
            mt-0.5
            w-4 h-4 rounded border flex items-center justify-center
            transition-colors
            ${checked
            ? "bg-accent border-accent"
            : "border-border-light dark:border-border-dark"}
          `}
        >
          {checked && <span className="w-2 h-2 bg-white rounded-sm"/>}
        </span>

        {/* 텍스트 영역 - label이 있을 때만 표시 */}
        {label && (
          <span className="text-sm text-text-primary-light dark:text-text-primary-dark">
            {required && <span className="text-red-500 mr-1">[필수]</span>}
            {label}

            {actionText && onActionClick && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onActionClick();
                }}
                className="ml-2 text-xs text-accent hover:underline"
              >
                {actionText}
              </button>
            )}
          </span>
        )}
      </label>

      {(error || helperText) && (
        <p
          className={`
            text-xs
            ${error
            ? "text-red-500"
            : "text-text-muted-light dark:text-text-muted-dark"}
          `}
        >
          {error ?? helperText}
        </p>
      )}
    </div>
  )
}