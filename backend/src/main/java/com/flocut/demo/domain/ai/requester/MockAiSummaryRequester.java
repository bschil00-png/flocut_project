package com.flocut.demo.domain.ai.requester;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component   // ⭐ Spring Bean 등록
public class MockAiSummaryRequester implements AiSummaryRequester {

    @Override
    public void requestSummary(
            Long fileId,
            Long sessionId,
            int roundNo,
            int versionNo
    ) {
        log.info(
                "[MOCK AI REQUEST] fileId={}, sessionId={}, round={}, version={}",
                fileId, sessionId, roundNo, versionNo
        );
    }
}
