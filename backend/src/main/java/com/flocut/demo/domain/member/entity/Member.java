package com.flocut.demo.domain.member.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDate;

@Entity
@Table(name = "tbl_member_test")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long memberId;

    @Column(nullable = false, length = 255, unique = true)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 20)
    private String tel;

    @Column(name = "profile_image", length = 500)
    private String profileImage;

    @Enumerated(EnumType.STRING)
    private MemberStatus status;

    @Column(name = "email_verified")
    private Boolean emailVerified;

    @Column(name = "email_verify_token")
    private String emailVerifyToken;

    private LocalDate regdate;
    private LocalDate moddate;
    private LocalDate deletedAt;

    @PrePersist
    public void onCreate() {
        this.regdate = LocalDate.now();
        this.moddate = LocalDate.now();
        this.emailVerified = false;
        this.status = MemberStatus.ACTIVE;
    }

    @PreUpdate
    public void onUpdate() {
        this.moddate = LocalDate.now();
    }
}
