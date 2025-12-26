
import SystemStatusCard from "../cards/SystemStatusCard";
import {systems} from "@/app/(admin)/admin/dashboard/data/dashboard.dummy";

export default function SystemStatusGrid() {
    return (
        <div className="grid grid-cols-4 gap-6">
            {systems.map((system) => (
                <SystemStatusCard key={system.name} {...system} />
            ))}
        </div>
    );
}
