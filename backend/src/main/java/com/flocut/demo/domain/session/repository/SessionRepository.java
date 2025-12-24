package com.flocut.demo.domain.session.repository;

import com.flocut.demo.domain.session.entity.Session;
import com.flocut.demo.domain.session.entity.SessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByMemberMemberIdAndStatusOrderByRegdateDesc(
            Long memberId,
            SessionStatus status
    );
}
