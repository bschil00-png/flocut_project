package com.flocut.demo.domain.document.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.flocut.demo.domain.document.dto.response.DocumentSummaryDetailResponse;
import com.flocut.demo.domain.document.dto.response.DocumentSummaryViewResponse;
import com.flocut.demo.domain.document.entity.DocumentSummary;
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
    public DocumentSummaryViewResponse getLatestSummaryViewByFileId(Long fileId) {

        DocumentSummary summary =
                summaryRepository
                        .findTopByFileFileIdOrderBySummaryIdDesc(fileId)
                        .orElseThrow(() -> new IllegalArgumentException("요약 정보 없음"));

        try {
            JsonNode root = objectMapper.readTree(summary.getSummaryText());

            // 1️⃣ main topic
            String mainTopic =
                    root.path("core_summary")
                            .path("main_topic")
                            .asText();

            // 2️⃣ key takeaways
            List<String> keyTakeaways =
                    objectMapper.convertValue(
                            root.path("core_summary")
                                    .path("key_takeaways"),
                            new TypeReference<List<String>>() {}
                    );

            // 3️⃣ sections
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

            // 4️⃣ final document
            String finalDoc =
                    root.path("final_polished_document").asText();

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

//    public DocumentSummaryDetailResponse getLatestSummaryByFileId(Long fileId) {
//
//        DocumentSummary summary =
//                summaryRepository
//                        .findTopByFileFileIdOrderBySummaryIdDesc(fileId)
//                        .orElseThrow(() ->
//                                new IllegalArgumentException("요약 정보 없음")
//                        );
//
//        return new DocumentSummaryDetailResponse(
//                summary.getSummaryId(),
//                summary.getFile().getFileId(),
//                summary.getStatus(),
//                summary.getSummaryText(),
//                summary.getModelVersion()
//        );
//    }
}

