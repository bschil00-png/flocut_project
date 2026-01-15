// "use client";
//
// import { useEffect, useRef } from "react";
// import { useQuery } from "@apollo/client/react";
// import { SUMMARY_STATUS_QUERY } from "@/lib/graphql/summary/summary.query";
// import { SummaryStatus } from "@/lib/graphql/summary/summary.type";
//
// interface Response {
//     summaryStatusById: {
//         status: SummaryStatus;
//     } | null;
// }
//
// export function useSummaryStatusPolling(
//     summaryId?: number,
//     onCompleted?: () => void
// ) {
//     const prevStatusRef = useRef<SummaryStatus | null>(null);
//
//     const { data, startPolling, stopPolling } = useQuery<Response>(
//         SUMMARY_STATUS_QUERY,
//         {
//             variables: { summaryId },
//             skip: !summaryId,
//             fetchPolicy: "network-only",
//         }
//     );
//
//     const status = data?.summaryStatusById?.status ?? null;
//
//     useEffect(() => {
//         if (!status) return;
//
//         if (status === "REQUESTED") {
//             startPolling(3000);
//         } else {
//             stopPolling();
//         }
//
//         if (
//             prevStatusRef.current === "REQUESTED" &&
//             status === "COMPLETED"
//         ) {
//             onCompleted?.();
//         }
//
//         prevStatusRef.current = status;
//
//         return () => stopPolling();
//     }, [status, startPolling, stopPolling, onCompleted]);
//
//     return status;
// }
