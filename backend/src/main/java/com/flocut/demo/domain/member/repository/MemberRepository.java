package com.flocut.demo.domain.member.repository;

import com.flocut.demo.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmail(String email);

    Optional<Member> findByEmailVerifyToken(String emailVerifyToken);
}