"use client"

type EmptyStateProps = {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
};

export default function EmptyState({
    title,
    description,
    icon,
    action,
    className = "",
                                   }: EmptyStateProps) {
    return (
        <div
            className={`
        flex
        flex-col
        items-center
        justify-center
        text-center
        py-16
        ${className}
      `}
        >
            {icon && (
                <div className="mb-4 text-text-muted-light dark:text-text-muted-dark">
                    {icon}
                </div>
            )}

            <h3 className="text-sm font-medium">
                {title}
            </h3>

            {description && (
                <p className="mt-1 text-xs text-text-muted-light dark:text-text-muted-dark">
                    {description}
                </p>
            )}

            {action && (
                <div className="mt-4">
                    {action}
                </div>
            )}
        </div>
    );
}