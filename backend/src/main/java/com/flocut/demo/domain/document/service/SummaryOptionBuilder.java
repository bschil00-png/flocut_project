package com.flocut.demo.domain.document.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SummaryOptionBuilder {

    private final ObjectMapper objectMapper;

    public String build(String summaryText) {
        try {
            JsonNode root = objectMapper.readTree(summaryText);

            ObjectNode option = objectMapper.createObjectNode();

            option.put(
                    "mainTopic",
                    root.path("core_summary")
                            .path("main_topic")
                            .asText(null)
            );

            option.set(
                    "keyTakeaways",
                    root.path("core_summary")
                            .path("key_takeaways")
            );

            option.set(
                    "sections",
                    root.path("organized_content")
            );

            option.put(
                    "finalDocument",
                    root.path("final_polished_document")
                            .asText(null)
            );

            return objectMapper.writeValueAsString(option);

        } catch (Exception e) {
            throw new RuntimeException("summary_option 생성 실패", e);
        }
    }
}
