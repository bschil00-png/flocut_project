export default function SystemStatusCard({
                                             name,
                                             status,
                                             latency,
                                             uptime,
                                         }: any) {
    const ok = status === "OK";

    return (
        <div className="bg-white rounded-xl border p-5 space-y-3">
            <div className="flex items-center gap-2">
        <span
            className={`w-2 h-2 rounded-full ${
                ok ? "bg-green-500" : "bg-yellow-500"
            }`}
        />
                <span className="font-medium text-sm">{name}</span>
            </div>

            <div className="text-xs flex justify-between">
                <span className="text-gray-500">Latency</span>
                <span>{latency}</span>
            </div>

            <div className="text-xs flex justify-between">
                <span className="text-gray-500">Uptime</span>
                <span>{uptime}</span>
            </div>
        </div>
    );
}
