import MetricCard from "../cards/MetricCard";
import {metrics} from "@/app/(admin)/admin/dashboard/data/dashboard.dummy";

export default function MetricGrid() {
    return (
        <div className="grid grid-cols-4 gap-6">
            {metrics.map((item) => (
                <MetricCard key={item.label} {...item} />
            ))}
        </div>
    );
}
