package com.flocut.demo.domain.admin.entity;

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

    @Column(name = "member_id", nullable = false)
    private Long memberId;

    @Column(name = "ip", nullable = false)
    private String ip;

    @Column(name = "device", nullable = false)
    private String device;

    @Column(name = "login_date", nullable = false)
    private LocalDateTime loginDate;






    public static LoginHistory create(
            Long memberId,
            String ip,
            String device
    ) {
        LoginHistory history = new LoginHistory();
        history.memberId = memberId;
        history.loginDate = LocalDateTime.now();
        history.ip = ip;
        history.device = device;
        return history;
    }
}