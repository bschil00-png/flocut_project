import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function MetricCard({
                                       label,
                                       value,
                                       change,
                                       trend,
                                       icon: Icon,
                                   }: any) {
    return (
        <div className="bg-white rounded-xl border p-6 space-y-3">
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">{label}</div>
                <Icon className="w-5 h-5 text-gray-400" />
            </div>

            <div className="text-2xl font-semibold">{value}</div>

            <div className="flex items-center gap-1 text-sm">
                {trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-600" />
                )}
                <span className={trend === "up" ? "text-green-600" : "text-red-600"}>
          {change}
        </span>
                <span className="text-gray-400">vs 이전</span>
            </div>
        </div>
    );
}
