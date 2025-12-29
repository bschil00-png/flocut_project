package com.flocut.demo.domain.ai.requester;

public interface AiSummaryRequester {

    /**
     * 요약 요청
     * - 실제 구현은 비동기
     * - 결과는 callback으로 받음
     */
    void requestSummary(
            Long fileId,
            Long sessionId,
            int roundNo,
            int versionNo
    );
}
