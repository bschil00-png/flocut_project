package com.flocut.demo.domain.document.service;

import com.flocut.demo.domain.document.entity.DocumentText;
import com.flocut.demo.domain.document.repository.DocumentTextRepository;
import com.flocut.demo.domain.file.entity.File;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class DocumentTextService {

    private final DocumentTextRepository documentTextRepository;

    /**
     * 파일 업로드 직후 호출
     * - 아직 텍스트 추출 전
     * - 문서 파이프라인 진입 기록
     */
    public DocumentText createEmptyText(File file) {

        // 🔒 중복 생성 방지
        if (documentTextRepository.existsByFile_FileId(file.getFileId())) {
            throw new IllegalStateException("이미 DocumentText가 존재합니다");
        }

        DocumentText text = DocumentText.create(
                file,
                null,      // language 아직 모름
                "",        // text_content placeholder
                false      // OCR 아직 안 씀
        );

        return documentTextRepository.save(text);
    }
}
