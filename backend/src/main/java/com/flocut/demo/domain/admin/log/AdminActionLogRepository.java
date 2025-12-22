package com.flocut.demo.domain.admin.log;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminActionLogRepository
        extends JpaRepository<AdminActionLog, Long> {
}
