package com.flocut.demo.domain.admin.entity;

import com.flocut.demo.domain.member.entity.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "tbl_member_login_history")
public class LoginHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "login_history_id", nullable = false)
    private Long loginHistoryId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "member_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_login_history_member")
    )
    private Member member;

    @Column(name = "ip", nullable = false)
    private String ip;

    @Column(name = "device", nullable = false)
    private String device;

    @Column(name = "login_date", nullable = false)
    private LocalDateTime loginDate;


    public static LoginHistory create(
            Member member,
            String ip,
            String device
    ) {
        LoginHistory history = new LoginHistory();
        history.member = member;
        history.loginDate = LocalDateTime.now();
        history.ip = ip;
        history.device = device;
        return history;
    }
}