package com.flocut.demo.domain.admin.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "tbl_admin_action_log")
public class AdminActionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "admin_action_log_id")
    private Long adminActionLogId;

    @Column(name = "admin_id", nullable = false)
    private Long adminId;

    @Column(name = "target_member_id")
    private Long targetMemberId;

    @Column(name = "action_type", nullable = false)
    private String actionType;

    @Column(name = "before_value")
    private String beforeValue;

    @Column(name = "after_value")
    private String afterValue;

    @Column(name = "reason")
    private String reason;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public static AdminActionLog create(
            Long adminId,
            Long targetMemberId,
            String actionType,
            String beforeValue,
            String afterValue,
            String reason
    ) {
        AdminActionLog log = new AdminActionLog();
        log.adminId = adminId;
        log.targetMemberId = targetMemberId;
        log.actionType = actionType;
        log.beforeValue = beforeValue;
        log.afterValue = afterValue;
        log.reason = reason;
        log.createdAt = LocalDateTime.now();
        return log;
    }
}

