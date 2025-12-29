package com.flocut.demo.domain.ai.requester;

public interface AiSummaryRequester {
    void requestSummary(
            Long fileId,
            Long sessionId,
            int roundNo,
            int versionNo
    );
}
