package com.flocut.demo.domain.note.entity;

import com.flocut.demo.domain.common.CommonStatus;
import com.flocut.demo.domain.document.entity.DocumentSummary;
import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.note.en.NoteSourceType;
import com.flocut.demo.domain.session.entity.Session;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;


@Entity
@Table(name = "tbl_note")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long noteId;

    // AI 요약 결과와 연동
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "summary_id")
    private DocumentSummary summary;

    // 해당 노트가 속한 세션(현재 노트 위치) / 추후 노트 이동 및 복사를 위해 null 허용 변경
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id")
    private Session session;

    // 작성자 정보
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    // 제목
    private String title;

    // 내용
    @Column(columnDefinition = "TEXT")
    private String content;

    // AI 요약 결과 원본(jsonb)을 문자열로 저장
    @Column(name = "summary_option", columnDefinition = "jsonb")
    private String summaryOption;

    // 노트 타입 (출처.. 노트/문서/오디오/AI)
    // 기본타입은 사용자 작성
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private NoteSourceType sourceType = NoteSourceType.MANUAL;

//      ai 요약본 연동
    private Long sourceId;

    // 노트 상태
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private CommonStatus status =  CommonStatus.ACTIVE;

    @CreationTimestamp
    private LocalDateTime regdate;

    @UpdateTimestamp
    private LocalDateTime moddate;

    private LocalDateTime deletedAt;


}
