import { gql } from "@apollo/client";


// 노트 생성

// AI 요약 결과를 기반으로 노트 생성
// 문서/음성/비교 결과 → 노트 페이지 생성
export const CREATE_NOTE_MUTATION = gql`
  mutation createNote($input: NoteCreateInput!) {
    createNote(input: $input) {
      noteId
      sessionId
      title
      status
      createdDate
      modifiedDate
    }
  }
`;

// 노트 수정

// 노트 내용 수정
// 사용자가 편집 후 저장할 때 호출
export const UPDATE_NOTE_MUTATION = gql`
  mutation updateNote($input: NoteUpdateInput!) {
    updateNote(input: $input) {
      noteId
      title
      content
      status
      modifiedDate
    }
  }
`;



// 노트 삭제 (Soft Delete)

// 노트 삭제
// 실제 데이터는 남기고 상태만 변경
export const DELETE_NOTE_MUTATION = gql`
  mutation deleteNote($noteId: Long!) {
    deleteNote(noteId: $noteId) {
      deleted
      message
    }
  }
`;
