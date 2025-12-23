package com.flocut.demo.domain.admin.repository;

import com.flocut.demo.domain.admin.entity.LoginHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoginHistoryRepository
        extends JpaRepository<LoginHistory, Long> {

    List<LoginHistory> findByMember_MemberIdOrderByLoginDateDesc(Long memberId);

}