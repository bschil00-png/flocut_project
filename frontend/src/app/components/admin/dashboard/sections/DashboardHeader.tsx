import { Calendar, Filter } from "lucide-react";

export default function DashboardHeader() {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-xl font-semibold">Dashboard</h1>
                <p className="text-sm text-text-muted-light">
                    플랫폼 운영 현황 요약
                </p>
            </div>

            <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm">
                    <Calendar className="w-4 h-4" />
                    최근 7일
                </button>

                <button className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm">
                    <Filter className="w-4 h-4" />
                    필터
                </button>
            </div>
        </div>
    );
}
