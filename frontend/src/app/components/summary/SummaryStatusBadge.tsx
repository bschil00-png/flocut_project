import { SummaryStatus } from "@/lib/graphql/summary/summary.type";

export function SummaryStatusBadge({ status }: { status: SummaryStatus }) {
  const map = {
    REQUESTED: "bg-yellow-100 text-yellow-700",
    COMPLETED: "bg-green-100 text-green-700",
    FAILED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
        map[status]
      }`}
    >
      {status}
    </span>
  );
}
