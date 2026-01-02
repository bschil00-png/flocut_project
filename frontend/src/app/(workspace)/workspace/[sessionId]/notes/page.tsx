"use client";

import {use, useState} from "react";
import NotesFilterBar from "@/app/components/notes/NotesFilterBar";
import NotesGridView from "@/app/components/notes/NotesGridView";
import NotesListView from "@/app/components/notes/NotesListView";
import {useParams} from "next/navigation";
import {useNotesBySession} from "@/hooks/note/useNotesBySession";
import Link from "next/link";

export default function NotesPage({
                                    params,
                                  }: {
  params: Promise<{ id: string }>}) {
  const {sessionId} = useParams<{sessionId:string}>();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recent");

  // 목록 조회
  const {data, loading} = useNotesBySession(Number(sessionId));

  // 결과
  const notes = data?.notesBySession ?? [];

  return (
    <div className="h-full flex flex-col">
      {/* 정렬 / 뷰 모드 바 */}
      <NotesFilterBar
        sortBy={sortBy}
        viewMode={viewMode}
        onChangeSort={setSortBy}
        onChangeViewMode={setViewMode}
        sessionId={Number(sessionId)}
      />


      {/* 노트 목록 */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {loading ? (
          <div className="text-sm text-text-muted-light">
            노트 불러오는 중...
          </div>
        ) : viewMode === "grid" ? (
          <NotesGridView notes={notes} />
        ) : (
          <NotesListView notes={notes} />
        )}
      </div>

      {/*<div className="flex h-full overflow-hidden">*/}
      {/*  /!* 에디터 영역 *!/*/}
      {/*  <EditorContainer*/}
      {/*    noteId={id}*/}
      {/*    onOpenContextPanel={handleOpenContextPanel}*/}
      {/*    contextPanelOpen={contextPanelOpen}*/}
      {/*  />*/}

      {/*  /!* 컨텍스트 패널 (우측) *!/*/}
      {/*  {contextPanelOpen && (*/}
      {/*    <ContextPanel*/}
      {/*      mode={contextPanelMode}*/}
      {/*      noteId={id}*/}
      {/*      onClose={() => setContextPanelOpen(false)}*/}
      {/*      onChangeMode={setContextPanelMode}*/}
      {/*    />*/}
      {/*  )}*/}
      {/*</div>*/}

    </div>
  );
}
