"use client";

import { useState } from "react";
import { checkNoteSummary } from "@/lib/rest/summary/summary.rest";
import {CheckSummaryResponse} from "@/lib/graphql/summary/summary.type";

export function useNoteSummaryCheck() {
    const [loading, setLoading] = useState(false);

    const checkSummary = async (noteId: number): Promise<CheckSummaryResponse> => {
        setLoading(true);
        try {
            const result = await checkNoteSummary(noteId);
            return result;
        } catch (error) {
            console.error("요약 확인 실패:", error);
            return {
                hasSummary: false,
                summaryId: null,
                status: null
            };
        } finally {
            setLoading(false);
        }
    };

    return { checkSummary, loading };
}