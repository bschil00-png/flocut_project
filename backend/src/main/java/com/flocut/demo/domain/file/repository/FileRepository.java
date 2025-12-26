package com.flocut.demo.domain.file.repository;

import com.flocut.demo.domain.file.entity.File;
import com.flocut.demo.domain.file.entity.FileStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FileRepository extends JpaRepository<File, Long> {

    List<File> findByMemberMemberIdAndStatusOrderByRegdateDesc(
            Long memberId,
            FileStatus status
    );
}
