package com.flocut.demo.domain.file.repository;

import com.flocut.demo.domain.file.entity.File;
import com.flocut.demo.domain.file.entity.FileStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FileRepository extends JpaRepository<File, Long> {

    Page<File> findBySessionSessionIdAndMemberMemberIdAndStatusOrderByRegdateDesc(
            Long sessionId,
            Long memberId,
            FileStatus status,
            Pageable pageable
    );
}
