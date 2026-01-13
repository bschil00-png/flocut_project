import { SummaryStatus } from "@/lib/graphql/summary/summary.type";
import { Clock, CheckCircle2, XCircle, Trash2 } from "lucide-react";

export function SummaryStatusBadge({ status }: { status: SummaryStatus }) {
    const config = {
        REQUESTED: {
            label: "생성 중",
            icon: Clock,
            className: "bg-yellow-50 text-yellow-700 border border-yellow-200",
        },
        COMPLETED: {
            label: "완료",
            icon: CheckCircle2,
            className: "bg-green-50 text-green-700 border border-green-200",
        },
        FAILED: {
            label: "실패",
            icon: XCircle,
            className: "bg-red-50 text-red-700 border border-red-200",
        },
        DELETED: {
            label: "삭제됨",
            icon: Trash2,
            className: "bg-gray-100 text-gray-500 border border-gray-300",
        },
    } as const;

    const { label, icon: Icon, className } = config[status];

    return (
        <span
            className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${className}`}
        >
      <Icon size={12} />
            {label}
    </span>
    );
}
