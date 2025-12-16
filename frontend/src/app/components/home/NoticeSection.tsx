/**
 * 공지사항 리스트 섹션
 */
export default function NoticeSection() {
  return (
    <section className="w-full bg-background-light dark:bg-background-dark">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">FLOCUT에서 알립니다</h2>
          <button className="text-sm text-accent">전체보기 →</button>
        </div>

        <ul className="space-y-4">
          {[
            "FloCut AI 요약 업데이트 안내",
            "음성 파일 업로드 기능 확장",
            "Workspace 베타 기능 오픈",
          ].map((item) => (
            <li
              key={item}
              className="
                flex justify-between
                border-b border-border-light dark:border-border-dark
                pb-3
                text-sm
              "
            >
              <span>{item}</span>
              <span className="text-text-muted-light">2025.12.10</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
