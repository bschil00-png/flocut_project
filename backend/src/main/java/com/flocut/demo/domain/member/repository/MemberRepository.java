package com.flocut.demo.domain.member.repository;

import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.entity.MemberStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmail(String email);

    Optional<Member> findByEmailVerifyToken(String emailVerifyToken);

    List<Member> findAllByTelAndStatus(String tel, MemberStatus status);

}