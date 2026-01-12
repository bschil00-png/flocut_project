package com.flocut.demo.domain.note.service;

import com.flocut.demo.domain.document.entity.DocumentSummary;
import com.flocut.demo.domain.document.service.DocumentSummaryWriteService;
import com.flocut.demo.domain.file.entity.File;
import com.flocut.demo.domain.file.entity.FileStatus;
import com.flocut.demo.domain.file.repository.FileRepository;
import com.flocut.demo.domain.note.entity.Note;
import com.flocut.demo.domain.note.repository.NoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NoteSummaryWriteService {

    private final FileRepository fileRepository;
    private final NoteRepository noteRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public File createTempFile(Long noteId, String s3Key) {

        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new IllegalArgumentException("노트 없음"));

        File tempFile = File.create(
                note.getMember(),
                note.getSession(),
                "note_summary_" + note.getNoteId() + ".txt",
                s3Key,
                "txt",
                "text/plain",
                (long) note.getContent().length()
        );
        tempFile.setStatus(FileStatus.NOTE_TEMP);

        return fileRepository.save(tempFile); // ✅ COMMIT
    }
}
