//package com.flocut.demo.domain.document.resolver;
//
//import com.flocut.demo.domain.document.dto.response.DocumentSummaryResponse;
//import org.springframework.graphql.data.method.annotation.Argument;
//import org.springframework.graphql.data.method.annotation.QueryMapping;
//
//import java.util.List;
//
//@QueryMapping
//public List<DocumentSummaryResponse> sessionSummaries(
//        @Argument Long sessionId
//) {
//    return summaryRepository
//            .findBySessionSessionIdAndDeletedAtIsNull(sessionId)
//            .stream()
//            .map(DocumentSummaryResponse::from)
//            .toList();
//}
