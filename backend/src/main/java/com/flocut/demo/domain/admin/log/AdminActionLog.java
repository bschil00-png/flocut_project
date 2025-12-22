package com.flocut.demo.domain.admin.log;

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
    private Long id;

    private Long adminId;          // 추후 SecurityContext에서 추출
    private Long targetMemberId;
    private String actionType;
    private String beforeValue;
    private String afterValue;
    private String reason;

    private LocalDateTime createdAt;

    public static AdminActionLog create(
            Long targetMemberId,
            String actionType,
            String beforeValue,
            String afterValue,
            String reason
    ) {
        AdminActionLog log = new AdminActionLog();
        log.targetMemberId = targetMemberId;
        log.actionType = actionType;
        log.beforeValue = beforeValue;
        log.afterValue = afterValue;
        log.reason = reason;
        log.createdAt = LocalDateTime.now();
        return log;
    }
}
