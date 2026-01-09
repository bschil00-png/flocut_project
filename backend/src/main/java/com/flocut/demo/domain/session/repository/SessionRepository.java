package com.flocut.demo.domain.session.repository;

import com.flocut.demo.domain.session.entity.Session;
import com.flocut.demo.domain.session.entity.SessionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface SessionRepository extends JpaRepository<Session, Long> {
    Page<Session> findByMemberMemberIdAndStatus(
            Long memberId,
            SessionStatus status,
            Pageable pageable
    );

    List<Session> findByMemberMemberIdAndStatusOrderByRegdateDesc(
            Long memberId,
            SessionStatus status
    );
}
