"use client"

export default function ActivityItem({
                                         type,
                                         title,
                                         description,
                                         time,
                                     }: any) {
    const color =
        type === "success"
            ? "bg-green-500"
            : type === "warning"
                ? "bg-yellow-500"
                : "bg-red-500";

    return (
        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
            <div className={`w-2 h-2 rounded-full mt-2 ${color}`} />

            <div className="flex-1">
                <div className="text-sm font-medium">{title}</div>
                <div className="text-xs text-gray-500">{description}</div>
                <div className="text-xs text-gray-400">{time}</div>
            </div>
        </div>
    );
}
