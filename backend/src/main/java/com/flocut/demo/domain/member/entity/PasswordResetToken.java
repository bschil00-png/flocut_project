package com.flocut.demo.domain.member.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_password_reset_token")
@Getter
@NoArgsConstructor
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(nullable = false)
    private LocalDateTime expiredAt;

    @Column(nullable = false)
    private boolean used = false;

    public static PasswordResetToken create(Member member, String token) {
        PasswordResetToken t = new PasswordResetToken();
        t.member = member;
        t.token = token;
        t.expiredAt = LocalDateTime.now().plusMinutes(30);
        return t;
    }
    public void markAsUsed() {
        this.used = true;
    }
}
