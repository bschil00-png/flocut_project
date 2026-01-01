package com.flocut.demo.domain.document.repository;

import com.flocut.demo.domain.document.entity.DocumentText;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentTextRepository
        extends JpaRepository<DocumentText, Long> {

    boolean existsByFile_FileId(Long fileId);
}
