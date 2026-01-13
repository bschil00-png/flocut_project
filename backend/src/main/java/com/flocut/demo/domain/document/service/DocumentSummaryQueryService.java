package com.flocut.demo.domain.document.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.flocut.demo.domain.document.dto.response.DocumentSummaryHistoryItem;
import com.flocut.demo.domain.document.dto.response.DocumentSummaryViewResponse;
import com.flocut.demo.domain.document.entity.DocumentSummary;
import com.flocut.demo.domain.document.entity.SummaryStatus;
import com.flocut.demo.domain.document.repository.DocumentSummaryRepository;
import com.flocut.demo.global.dto.PageRequestDTO;
import com.flocut.demo.global.dto.PageResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
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

    // summaryId 기준 단건 조회 (COMPLETED만)
    public DocumentSummaryViewResponse getSummaryViewBySummaryId(Long summaryId) {

        DocumentSummary summary =
                summaryRepository
                        .findBySummaryIdAndStatus(summaryId, SummaryStatus.COMPLETED)
                        .orElseThrow(() ->
                                new IllegalArgumentException("완료된 요약 없음")
                        );

        return parseSummaryOption(summary);
    }

    // file + session 기준 최신 COMPLETED 요약
    public DocumentSummaryViewResponse getLatestCompletedSummaryByFile(
            Long fileId,
            Long sessionId
    ) {

        DocumentSummary summary =
                summaryRepository
                        .findLatestByFileAndSessionAndStatus(
                                fileId,
                                sessionId,
                                SummaryStatus.COMPLETED
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException("완료된 요약 없음")
                        );

        return parseSummaryOption(summary);
    }

    // file + session + version 조회 (DELETED 제외 )
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

    // 히스토리 조회 (DELETED 제외)
    public PageResponseDTO<DocumentSummaryHistoryItem> getSummaryHistory(
            Long fileId,
            Long sessionId,
            PageRequestDTO pageRequest
    ) {

        Page<DocumentSummary> page =
                summaryRepository.findByFileFileIdAndSessionSessionIdAndStatusNot(
                        fileId,
                        sessionId,
                        SummaryStatus.DELETED,
                        PageRequest.of(
                                pageRequest.getPage(),
                                pageRequest.getSize(),
                                Sort.by(Sort.Direction.DESC, "versionNo")
                        )
                );

        return new PageResponseDTO<>(
                page.getContent()
                        .stream()
                        .map(summary ->
                                DocumentSummaryHistoryItem.builder()
                                        .summaryId(summary.getSummaryId())
                                        .versionNo(summary.getVersionNo())
                                        .status(summary.getStatus())
                                        .createdAt(summary.getRegdate())
                                        .build()
                        )
                        .toList(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.getNumber(),
                page.getSize(),
                page.hasNext(),
                page.hasPrevious(),
                page.isFirst(),
                page.isLast()
        );
    }

    // summary_option 파싱
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

                JsonNode contentNode = node.path("content");

                String content =
                        contentNode.isTextual()
                                ? contentNode.asText()
                                : objectMapper.writeValueAsString(contentNode);

                sections.add(
                        DocumentSummaryViewResponse.SectionResponse.builder()
                                .title(node.path("section_title").asText())
                                .content(content)
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
