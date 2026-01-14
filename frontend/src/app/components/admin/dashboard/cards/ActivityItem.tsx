// src/components/admin/dashboard/sections/ActivitySection.tsx


import ActivityItem from "../cards/ActivityItem";
import {dashboardActivities} from "@/app/components/admin/dashboard/data/dashboard.dummy";


export default function ActivitySection() {
    return (
        <div className="col-span-4 bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
                Live Activity
            </h2>

            <div className="space-y-1">
                {dashboardActivities.map((activity, index) => (
                    <ActivityItem key={index} {...activity} />
                ))}
            </div>
        </div>
    );
}
