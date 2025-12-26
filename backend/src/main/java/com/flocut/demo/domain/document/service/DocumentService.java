//package com.flocut.demo.domain.document.service;
//
//import com.flocut.demo.domain.document.entity.DocumentSummary;
//import com.flocut.demo.domain.document.entity.DocumentText;
//import com.flocut.demo.domain.document.repository.DocumentSummaryRepository;
//import com.flocut.demo.domain.document.repository.DocumentTextRepository;
//import com.flocut.demo.domain.file.entity.File;
//import com.flocut.demo.domain.session.entity.Session;
//import jakarta.transaction.Transactional;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//@Service
//@RequiredArgsConstructor
//@Transactional
//public class DocumentService {
//
//    private final DocumentTextRepository textRepository;
//    private final DocumentSummaryRepository summaryRepository;
//
//    /* 파일 → 원문 텍스트 저장 */
//    public void saveText(
//            File file,
//            String language,
//            String text,
//            boolean ocrUsed
//    ) {
//        textRepository.save(
//                DocumentText.create(file, language, text, ocrUsed)
//        );
//    }
//
//    /* 요약 결과 저장 */
//    public void saveSummary(
//            File file,
//            Session session,
//            int roundNo,
//            int versionNo,
//            String summary,
//            String modelVersion
//    ) {
//        summaryRepository.save(
//                DocumentSummary.create(
//                        file,
//                        session,
//                        roundNo,
//                        versionNo,
//                        summary,
//                        modelVersion
//                )
//        );
//    }
//}
