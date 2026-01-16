"use client";

import { useState } from "react";
import {
  requestDocumentSummary,
  requestNoteSummary,
} from "@/lib/rest/summary/summary.rest";

type SummaryRequestParams =
  | { type: "document"; fileId: number; sessionId: number }
  | { type: "note"; noteId: number };

export function useSummaryRequest() {
  const [loading, setLoading] = useState(false);

  const requestSummary = async (
    params: SummaryRequestParams
  ): Promise<number> => {
    setLoading(true);
    try {
      if (params.type === "document") {
        return await requestDocumentSummary({
          fileId: params.fileId,
          sessionId: params.sessionId,
        });
      }

      return await requestNoteSummary(params.noteId);
    } finally {
      setLoading(false);
    }
  };

  return {
    requestSummary,
    loading,
  };
}
