package com.flocut.demo.domain.common;

public enum CommonStatus {
    ACTIVE,   // 현재 사용 중 (활성)
    ARCHIVED, // 보관됨 (읽기 전용 등)
    DELETED,  // 삭제됨 (Soft Delete)
    READY     // 준비 중 (필요 시 활용)
}
