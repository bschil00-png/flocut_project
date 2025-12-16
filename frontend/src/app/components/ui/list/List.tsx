"use client"

// 여러개의 리스트 아이템을 수직으로 나열하는 공용 컴포넌트
type  ListProps = {
    // 리스트 아이템들이 들어오는 자리
    children: React.ReactNode;
    className?: string;
}

export default function List({ children , className =""}: ListProps) {
    return (
        // 역할 리스트로 고정
        <div
            role="list"
        className={`
        flex 
        flex-col
        divide-y divide-border-light dark:divide-border-dark
        ${className}
        `}
        >
            {children}
        </div>
    )
}