package com.flocut.demo.domain.admin.repository;

import com.flocut.demo.domain.admin.entity.LoginHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoginHistoryRepository extends JpaRepository<LoginHistory, Long> {
// 관리자 로그인 이력 조회
    Page<LoginHistory> findByMember_MemberId(
            Long memberId,
            Pageable pageable
    );
}
