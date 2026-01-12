package com.flocut.demo.domain.note.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public final class SummaryContentExtractor {

  private static final ObjectMapper mapper = new ObjectMapper();

  private SummaryContentExtractor() {
  }

  public static String extractEditableContent(String summaryOptionJson) {
    if (summaryOptionJson == null || summaryOptionJson.isBlank()) {
      return "";
    }

    try {
      JsonNode root = mapper.readTree(summaryOptionJson);
      StringBuilder html = new StringBuilder();

      // 핵심 주제
      String mainTopic = root.path("mainTopic").asText(null);
      if (mainTopic != null && !mainTopic.isBlank()) {
        html.append("<div style='padding:20px;margin-bottom:24px;background:linear-gradient(to right,rgba(242,85,85,0.05),rgba(242,85,85,0.1));border-left:4px solid #f25555;border-radius:12px'>");
        html.append("<p style='font-size:12px;font-weight:600;color:#f25555;text-transform:uppercase;margin-bottom:8px'>핵심 주제</p>");
        html.append("<h2 style='font-size:20px;font-weight:700;margin:0'>").append(escapeHtml(mainTopic)).append("</h2>");
        html.append("</div>");
      }

      // 주요 포인트
      JsonNode keyTakeaways = root.path("keyTakeaways");
      if (keyTakeaways.isArray() && keyTakeaways.size() > 0) {
        html.append("<div style='padding:20px;margin-bottom:20px;background:#fff;border:1px solid #e4e6eb;border-radius:12px'>");
        html.append("<h3 style='font-size:16px;font-weight:700;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid #e4e6eb'>주요 포인트</h3>");
        html.append("<ol style='padding-left:24px;margin:0'>");

        for (JsonNode item : keyTakeaways) {
          String text = item.asText("");
          if (!text.isBlank()) {
            html.append("<li style='margin-bottom:8px;line-height:1.6'>").append(escapeHtml(text)).append("</li>");
          }
        }

        html.append("</ol>");
        html.append("</div>");
      }

      // 섹션별 내용
      JsonNode sections = root.path("sections");
      if (sections.isArray() && sections.size() > 0) {
        for (JsonNode section : sections) {
          String title = section.path("section_title").asText("");
          String content = section.path("content").asText("");

          if (!title.isBlank() || !content.isBlank()) {
            html.append("<div style='padding:20px;margin-bottom:20px;background:#fff;border:1px solid #e4e6eb;border-radius:12px'>");

            if (!title.isBlank()) {
              html.append("<h3 style='font-size:16px;font-weight:700;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid #e4e6eb'>")
                      .append(escapeHtml(title))
                      .append("</h3>");
            }

            if (!content.isBlank()) {
              String[] paragraphs = content.split("\n\n");
              for (String p : paragraphs) {
                if (!p.trim().isBlank()) {
                  html.append("<p style='line-height:1.7;margin-bottom:12px'>")
                          .append(escapeHtml(p.trim()))
                          .append("</p>");
                }
              }
            }

            html.append("</div>");
          }
        }
      }

      // 전체 문서 (섹션 없을 때만)
      if (sections.size() == 0) {
        String finalDoc = root.path("finalDocument").asText("");
        if (!finalDoc.isBlank()) {
          html.append("<div style='padding:20px;background:#fff;border:1px solid #e4e6eb;border-radius:12px'>");
          html.append(convertMarkdownToHtml(finalDoc));
          html.append("</div>");
        }
      }

      return html.toString();

    } catch (Exception e) {
      return summaryOptionJson;
    }
  }

  private static String convertMarkdownToHtml(String markdown) {
    StringBuilder html = new StringBuilder();
    String[] lines = markdown.split("\n");
    StringBuilder paragraph = new StringBuilder();

    for (String line : lines) {
      line = line.trim();

      if (line.startsWith("## ")) {
        finishParagraph(html, paragraph);
        html.append("<h3 style='font-size:16px;font-weight:700;margin:20px 0 12px 0'>")
                .append(escapeHtml(line.substring(3).trim()))
                .append("</h3>");
      }
      else if (line.startsWith("# ")) {
        finishParagraph(html, paragraph);
        html.append("<h2 style='font-size:18px;font-weight:700;margin:24px 0 12px 0'>")
                .append(escapeHtml(line.substring(2).trim()))
                .append("</h2>");
      }
      else if (line.isEmpty()) {
        finishParagraph(html, paragraph);
      }
      else {
        if (paragraph.length() > 0) paragraph.append(" ");
        paragraph.append(line);
      }
    }

    finishParagraph(html, paragraph);
    return html.toString();
  }

  private static void finishParagraph(StringBuilder html, StringBuilder paragraph) {
    if (paragraph.length() > 0) {
      html.append("<p style='line-height:1.7;margin-bottom:12px'>")
              .append(escapeHtml(paragraph.toString()))
              .append("</p>");
      paragraph.setLength(0);
    }
  }

  private static String escapeHtml(String text) {
    if (text == null) return "";

    return text
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("\"", "&quot;")
            .replace("'", "&#39;");
  }
}