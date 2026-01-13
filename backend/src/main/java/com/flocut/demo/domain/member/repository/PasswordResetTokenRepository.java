package com.flocut.demo.domain.member.repository;

import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.entity.PasswordResetToken;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.Optional;

public interface PasswordResetTokenRepository
        extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(String token);

    // 아직 유효한 토큰 존재 여부 확인
    @Query("""
        SELECT t FROM PasswordResetToken t
        WHERE t.member = :member
          AND t.used = false
          AND t.expiredAt > :now
    """)
    Optional<PasswordResetToken> findActiveToken(
            @Param("member") Member member,
            @Param("now") LocalDateTime now
    );
}
