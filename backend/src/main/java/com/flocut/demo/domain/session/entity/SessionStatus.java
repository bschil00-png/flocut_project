package com.flocut.demo.domain.session.entity;

public enum SessionStatus {
    ACTIVE, //현재 사용 중인 세션
    ARCHIVED, //보관된 세션 (읽기 중심)
    DELETED  //삭제된 세션 (소프트 삭제)
}