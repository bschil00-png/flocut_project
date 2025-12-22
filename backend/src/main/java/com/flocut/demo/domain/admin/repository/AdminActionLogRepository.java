package com.flocut.demo.domain.admin.repository;

import com.flocut.demo.domain.admin.entity.AdminActionLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminActionLogRepository
        extends JpaRepository<AdminActionLog, Long> {
}
