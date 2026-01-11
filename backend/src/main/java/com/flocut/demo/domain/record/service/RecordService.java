package com.flocut.demo.domain.record.service;

import com.flocut.demo.domain.member.entity.Member;
import com.flocut.demo.domain.member.repository.MemberRepository;
import com.flocut.demo.domain.note.service.NoteFacade;
import com.flocut.demo.domain.record.dto.request.RecordCreateRequest;
import com.flocut.demo.domain.record.dto.response.RecordResponse;
import com.flocut.demo.domain.record.entity.RecordFile; // 엔티티 클래스 확인
import com.flocut.demo.domain.record.repository.RecordFileRepository; // 레포지토리 클래스 확인
import com.flocut.demo.domain.session.entity.Session;
import com.flocut.demo.domain.session.repository.SessionRepository;
import com.flocut.demo.global.dto.PageRequestDTO;
import com.flocut.demo.global.dto.PageResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RecordService {

    private final RecordFileRepository recordFileRepository;
    private final SessionRepository sessionRepository;
    private final MemberRepository memberRepository;
    private final NoteFacade noteFacade;

    @Transactional
    public Long save(Member member, RecordCreateRequest request) { // memberId 대신 Member를 받음
        // 세션 확인 및 권한 체크
        Session session = sessionRepository.findById(request.getSessionId())
                .orElseThrow(() -> new IllegalArgumentException("세션 없음"));

        if (!session.getMember().getMemberId().equals(member.getMemberId())) {
            throw new SecurityException("권한 없음");
        }

        //  음성 조각 원본 저장 (ID로 다시 조회할 필요 없이 바로 사용)
        RecordFile recordFile = new RecordFile(session, member, request.getContent());
        recordFileRepository.save(recordFile);

        //  실시간 반영
        if (request.getNoteId() != null) {
            noteFacade.appendSingleRecordToNote(request.getNoteId(), request.getContent(), member.getMemberId());
        }

        return recordFile.getRecordId();
    }

    @Transactional(readOnly = true)
    public PageResponseDTO<RecordResponse> getBySession(Long sessionId, Long memberId, PageRequestDTO page) {
        Pageable pageable = PageRequest.of(page.getPage(), page.getSize());

        Page<RecordFile> result = recordFileRepository
                .findBySessionSessionIdAndSessionMemberMemberIdOrderByCreatedAtDesc(sessionId, memberId, pageable);

        List<RecordResponse> content = result.getContent().stream()
                .map(r -> new RecordResponse(
                        r.getRecordId(), // recordId 호출
                        r.getContent(),
                        r.getCreatedAt()
                ))
                .toList();

        return new PageResponseDTO<>(content, result.getTotalElements(), result.getTotalPages(),
                result.getNumber(), result.getSize(), result.hasNext(), result.hasPrevious(),
                result.isFirst(), result.isLast());
    }

    public void update(Long recordId, Long memberId, String content) {
        RecordFile recordFile = recordFileRepository.findByRecordIdAndMemberMemberId(recordId, memberId)
                .orElseThrow(() -> new IllegalArgumentException("수정 권한이 없거나 존재하지 않는 기록입니다."));

        recordFile.updateContent(content);
    }

    public int bulkDelete(Long memberId, List<Long> recordIds) {
        if (recordIds == null || recordIds.isEmpty()) {
            throw new IllegalArgumentException("삭제할 항목이 없습니다.");
        }
        return recordFileRepository.deleteByRecordIdInAndMemberMemberId(recordIds, memberId);
    }
}