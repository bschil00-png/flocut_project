package com.flocut.demo.domain.note.repository;

import com.flocut.demo.domain.note.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {

    List<Note> findBySession_SessionIdAndMember_MemberIdAndStatus(
            Long sessionId,
            Long memberId,
            String status
    );
}

