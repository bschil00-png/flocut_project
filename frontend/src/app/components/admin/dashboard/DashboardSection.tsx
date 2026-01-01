"use client";

type DashboardSectionProps = {
    title: string;
    description?: string;
    children: React.ReactNode;
};

// 섹션 래퍼
export default function DashboardSection({
    title,
    description,
    children,}: DashboardSectionProps) {
    return (
        <section className="space-y-3">
            <div>
                <h2 className="text-sm font-semibold">
                    {title}
                </h2>
                {description && (
                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                        {description}
                    </p>
                )}
            </div>

            {children}
        </section>
    );
}