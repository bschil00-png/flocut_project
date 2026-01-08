package com.flocut.demo.domain.document.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.flocut.demo.domain.document.dto.response.DocumentSummaryHistoryItem;
import com.flocut.demo.domain.document.dto.response.DocumentSummaryViewResponse;
import com.flocut.demo.domain.document.entity.DocumentSummary;
import com.flocut.demo.domain.document.entity.SummaryStatus;
import com.flocut.demo.domain.document.repository.DocumentSummaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DocumentSummaryQueryService {

    private final DocumentSummaryRepository summaryRepository;
    private final ObjectMapper objectMapper;

    /* ======================================================
       📌 summaryId 기준 단건 조회
       ====================================================== */
    public DocumentSummaryViewResponse getSummaryViewBySummaryId(Long summaryId) {

        DocumentSummary summary =
                summaryRepository
                        .findBySummaryIdAndStatus(summaryId, SummaryStatus.COMPLETED)
                        .orElseThrow(() ->
                                new IllegalArgumentException("완료된 요약 없음")
                        );

        return parseSummaryOption(summary);
    }

    /* ======================================================
       📌 file 기준 최신 요약 조회
       ====================================================== */
    public DocumentSummaryViewResponse getLatestSummaryViewByFile(Long fileId) {

        DocumentSummary summary =
                summaryRepository
                        .findTopByFileFileIdOrderBySummaryIdDesc(fileId)
                        .orElseThrow(() ->
                                new IllegalArgumentException("완료된 요약 없음")
                        );

        return parseSummaryOption(summary);
    }

    /* ======================================================
       📌 file + session + version 기준 조회
       ====================================================== */
    public DocumentSummaryViewResponse getSummaryByVersion(
            Long fileId,
            Long sessionId,
            int versionNo
    ) {

        DocumentSummary summary =
                summaryRepository
                        .findByFileFileIdAndSessionSessionIdAndVersionNo(
                                fileId,
                                sessionId,
                                versionNo
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException("해당 버전의 요약 없음")
                        );

        return parseSummaryOption(summary);
    }

    /* ======================================================
       📌 요약 히스토리 조회
       ====================================================== */
    public List<DocumentSummaryHistoryItem> getSummaryHistory(
            Long fileId,
            Long sessionId
    ) {

        return summaryRepository
                .findByFileFileIdAndSessionSessionIdOrderByVersionNoDesc(
                        fileId,
                        sessionId
                )
                .stream()
                .map(summary ->
                        DocumentSummaryHistoryItem.builder()
                                .summaryId(summary.getSummaryId())
                                .versionNo(summary.getVersionNo())
                                .status(summary.getStatus())
                                .createdAt(summary.getRegdate())
                                .build()
                )
                .toList();
    }

    /* ======================================================
       🔨 summary_option 파싱 (서비스 전용 JSON)
       ====================================================== */
    private DocumentSummaryViewResponse parseSummaryOption(
            DocumentSummary summary
    ) {

        try {
            JsonNode root =
                    objectMapper.readTree(summary.getSummaryOption());

            String mainTopic =
                    root.path("mainTopic").asText(null);

            List<String> keyTakeaways =
                    objectMapper.convertValue(
                            root.path("keyTakeaways"),
                            new TypeReference<List<String>>() {}
                    );

            List<DocumentSummaryViewResponse.SectionResponse> sections =
                    new ArrayList<>();

            for (JsonNode node : root.path("sections")) {
                sections.add(
                        DocumentSummaryViewResponse.SectionResponse.builder()
                                .title(node.path("title").asText())
                                .content(node.path("content").asText())
                                .build()
                );
            }

            String finalDocument =
                    root.path("finalDocument").asText(null);

            return DocumentSummaryViewResponse.builder()
                    .summaryId(summary.getSummaryId())
                    .mainTopic(mainTopic)
                    .keyTakeaways(keyTakeaways)
                    .sections(sections)
                    .finalDocument(finalDocument)
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("summary_option 파싱 실패", e);
        }
    }
}
