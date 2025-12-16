"use client"
// 나중에 로그인 약관동의 같은 곳에 사용할 체크 박스 공용 컴포넌트
type  CheckboxProps = {
    label: string;
    // 제어 컴포넌트 선언 (체크 박스 자체는 상태를 안 가짐)
    checked: boolean;

    // 체크 상태 변경 콜백(DOM 이벤트는 Checkbox 내부에서 처리)
    onChange: (checked: boolean) => void;
    // 유효성 실패시
    error?: string;

    // 보조 텍스트 문구(안내 문구)
    helperText?: string;

    // 비활성화 여부
    disabled?: boolean;

    // 추가 클래스 네임
    className?: string;
}

export default function Checkbox({
                                     label, checked, onChange, error, helperText, disabled = false, className = ""
                                 }: CheckboxProps) {
    return (
        <div className={`space-y-1.5 ${className}`}>
            <label
                className={`
                  flex items-center gap-2 cursor-pointer
                  ${disabled ? "cursor-not-allowed opacity-60" : ""}
                `}
            >

                {/*인풋 태그 */}
                <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={e => onChange(e.target.checked)}
                    className="sr-only"
                />
                <span
                    className={` 
                     w-4 h-4 rounded border flex items-center justify-center transition-colors
                         ${checked ? "bg-accent border-accent" : "border-border-light dark:border-border-dark"}
          `}
                >
          {checked && (
              <span className="w-2 h-2 bg-white rounded-sm"/>
          )}
        </span>

                <span className="text-sm text-text-primary-light dark:text-text-primary-dark">
          {label}
        </span>
            </label>
            {(error || helperText) && (
                <p
                    className={`
            text-xs
            ${
                        error
                            ? "text-red-500"
                            : "text-text-muted-light dark:text-text-muted-dark"
                    }
          `}
                >
                    {error ?? helperText}
                </p>
            )}
        </div>
    )
}