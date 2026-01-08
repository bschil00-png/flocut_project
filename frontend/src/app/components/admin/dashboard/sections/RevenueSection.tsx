import { BarChart3 } from "lucide-react";

export default function RevenueSection() {
    return (
        <div className="col-span-8 bg-white rounded-xl border p-6">
            <div className="mb-4">
                <h2 className="font-semibold">매출 분석</h2>
                <p className="text-sm text-gray-500">월별 매출 추이</p>
            </div>

            <div className="h-72 flex items-center justify-center border rounded-lg bg-gray-50">
                <BarChart3 className="w-12 h-12 text-gray-300" />
            </div>
        </div>
    );
}
