package com.flocut.demo.domain.document.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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




    //  문서요약 조회
    public DocumentSummaryViewResponse getSummaryViewBySummaryId(Long summaryId) {

        DocumentSummary summary =
                summaryRepository
                        .findBySummaryIdAndStatus(summaryId, SummaryStatus.COMPLETED)
                        .orElseThrow(() -> new IllegalArgumentException("완료된 요약 없음"));

        return parseSummary(summary);
    }

    /* ======================================================
       🔧 file 기준 대표 요약 조회 (보조 API)
       ====================================================== */
    public DocumentSummaryViewResponse getLatestSummaryViewByFile(
            Long fileId
//            Long sessionId
    ) {

        DocumentSummary summary =
                summaryRepository
//                        .findLatestCompletedSummary(fileId, sessionId)
                        .findTopByFileFileIdOrderBySummaryIdDesc(fileId)
                        .orElseThrow(() -> new IllegalArgumentException("완료된 요약 없음"));

        return parseSummary(summary);
    }

    /* ======================================================
       🔨 JSON 파싱 공통 로직
       ====================================================== */
    private DocumentSummaryViewResponse parseSummary(DocumentSummary summary) {

        try {
            JsonNode root = objectMapper.readTree(summary.getSummaryText());

            String mainTopic =
                    root.path("core_summary")
                            .path("main_topic")
                            .asText(null);

            List<String> keyTakeaways =
                    objectMapper.convertValue(
                            root.path("core_summary").path("key_takeaways"),
                            new TypeReference<List<String>>() {}
                    );

            List<DocumentSummaryViewResponse.SectionResponse> sections =
                    new ArrayList<>();

            for (JsonNode node : root.path("organized_content")) {
                sections.add(
                        DocumentSummaryViewResponse.SectionResponse.builder()
                                .title(node.path("section_title").asText())
                                .content(node.path("content").asText())
                                .build()
                );
            }

            String finalDoc =
                    root.path("final_polished_document").asText(null);

            return DocumentSummaryViewResponse.builder()
                    .summaryId(summary.getSummaryId())
                    .mainTopic(mainTopic)
                    .keyTakeaways(keyTakeaways)
                    .sections(sections)
                    .finalDocument(finalDoc)
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("요약 JSON 파싱 실패", e);
        }
    }
}
