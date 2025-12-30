"use client";

import {use, useState} from "react";
import UploadHeader from "@/app/components/header/UploadHeader";
import NotesFilterBar from "@/app/components/notes/NotesFilterBar";
import NotesGridView from "@/app/components/notes/NotesGridView";
import NotesListView from "@/app/components/notes/NotesListView";
import ContextPanel from "@/app/components/layout/WorkspaceLayout/ContextPanel";
import {useRouter} from "next/navigation";
import EditorContainer from "@/app/components/notes/editor/EditorContainer";

export default function NotesPage({
                                    params,
                                  }: {
  params: Promise<{ id: string }>}) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recent");

  const notes = [
    {
      id: "1",
      title: "3월 마케팅 회의",
      preview: "Q1 성과 리뷰 및 2분기 전략 수립에 대한 논의...",
      date: "2시간 전",
      type: "note",
      starred: true,
      tags: ["회의", "마케팅"],
    },
    {
      id: "2",
      title: "FloCut 기획 정리",
      preview: "핵심 기능 명세 및 MVP 범위 정의...",
      date: "어제",
      type: "document",
      starred: false,
      tags: ["기획", "프로젝트"],
    },
    {
      id: "3",
      title: "개발 일정 정리",
      preview: "스프린트 계획 및 마일스톤 설정...",
      date: "3일 전",
      type: "note",
      starred: false,
      tags: ["개발", "일정"],
    },
    {
      id: "4",
      title: "음성 회의록 - 2024.12.15",
      preview: "음성 녹음을 기반으로 자동 생성된 회의록...",
      date: "5일 전",
      type: "audio",
      starred: true,
      tags: ["회의", "음성"],
    },
  ];

  // const { id } = use(params);
  // const router = useRouter();
  // const [contextPanelOpen, setContextPanelOpen] = useState(false);
  // const [contextPanelMode, setContextPanelMode] = useState<
  //   "properties" | "ai-summary" | "ai-feedback" | "ai-compare" | "versions" | "comments"
  // >("properties");
  //
  // const handleOpenContextPanel = (
  //   mode: "properties" | "ai-summary" | "ai-feedback" | "ai-compare" | "versions" | "comments"
  // ) => {
  //   setContextPanelMode(mode);
  //   setContextPanelOpen(true);
  // };


  return (
    <div className="h-full flex flex-col bg-background-light dark:bg-background-dark">
      {/* 상단 헤더 */}
      <UploadHeader total={notes.length} />

      {/* 필터 / 정렬 / 뷰 모드 */}
      <NotesFilterBar
        sortBy={sortBy}
        viewMode={viewMode}
        onChangeSort={setSortBy}
        onChangeViewMode={setViewMode}
      />

      {/* 노트 목록 */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {viewMode === "grid" ? (
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
