import {NoteSourceType} from "@/lib/graphql/note/note.type";


export interface NoteDraft {

  // 제목
  title: string;
  // 내용
  content: string;
  // 노트 생성 출처
  sourceType: NoteSourceType;
  // 출처 리소스
  sourceId: number;
  // 소속 세션(폴더 쪽)
  sessionId: number;
}