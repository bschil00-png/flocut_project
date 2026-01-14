import DashboardHeader from "@/app/components/admin/dashboard/sections/DashboardHeader";
import MetricGrid from "@/app/components/admin/dashboard/sections/MetricGrid";
import RevenueSection from "@/app/components/admin/dashboard/sections/RevenueSection";
import ActivitySection from "@/app/components/admin/dashboard/sections/ActivitySection";
import SystemStatusGrid from "@/app/components/admin/dashboard/sections/SystemStatusGrid";

export default function AdminDashboardPage() {
    return (
        <div className="space-y-10">
            <DashboardHeader />

            <MetricGrid />

            <div className="grid grid-cols-12 gap-6">
                <RevenueSection />
                <ActivitySection />
            </div>

            <SystemStatusGrid />
        </div>
    );
}
