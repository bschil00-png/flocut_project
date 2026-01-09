package com.flocut.demo.domain.record.entity;

import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.session.entity.Session;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_record")
@Getter
@NoArgsConstructor
public class Record {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long recordId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Record(Session session, Member member, String content) {
        this.session = session;
        this.member = member;
        this.content = content;
    }

    public void updateContent(String content) {
        this.content = content;
    }
}
