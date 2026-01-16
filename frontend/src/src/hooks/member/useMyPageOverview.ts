"use client";

import { useEffect, useState } from "react";
import { apolloClient } from "@/lib/apollo/clients";
import { MY_PAGE_OVERVIEW_QUERY } from "@/lib/graphql/mypage/mypage.query";
import { MyPageOverview } from "@/lib/graphql/mypage/mypage.type";

// 마이페이지 대시보드 조회 훅
export function useMyPageOverview() {
    const [data, setData] = useState<MyPageOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let mounted = true;

        async function fetchMyPage() {
            setLoading(true);
            setError(null);

            try {
                const result = await apolloClient.query<{
                    myPage: MyPageOverview;
                }>({
                    query: MY_PAGE_OVERVIEW_QUERY,
                    fetchPolicy: "network-only",
                });

                if (!mounted) return;

                // data가 없는 경우는 비정상 상태로 처리
                if (!result.data) {
                    throw new Error("MyPage query returned no data");
                }

                setData(result.data.myPage);
            } catch (err) {
                if (!mounted) return;
                setError(err as Error);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        fetchMyPage();

        return () => {
            mounted = false;
        };
    }, []);

    return {
        data,
        loading,
        error,
    };
}
