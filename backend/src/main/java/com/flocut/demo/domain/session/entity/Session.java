package com.flocut.demo.domain.session.entity;

import com.flocut.demo.domain.member.entity.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_session")
@Getter
@NoArgsConstructor
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sessionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(nullable = false, length = 255)
    private String sessionTitle;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SessionStatus status;

    @CreationTimestamp
    private LocalDateTime regdate;

    @UpdateTimestamp
    private LocalDateTime moddate;

    /* 생성 */
    public static Session create(Member member, String title, String description) {
        Session session = new Session();
        session.member = member;
        session.sessionTitle = title;
        session.description = description;
        session.status = SessionStatus.ACTIVE;
        return session;
    }

    /* PATCH */
    public void changeTitle(String title) {
        if (title == null || title.isBlank()) return;
        this.sessionTitle = title;
    }

    public void changeDescription(String description) {
        if (description == null) return;
        this.description = description;
    }

    /* 상태 전이 */
    public void archive() {
        this.status = SessionStatus.ARCHIVED;
    }

    public void delete() {
        this.status = SessionStatus.DELETED;
    }
}


