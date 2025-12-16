/**
 * 반복 업무 대체 강조 섹션
 */
export default function ReplaceWorkSection() {
  return (
    <section className="w-full bg-background-light dark:bg-background-dark">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="text-3xl font-bold mb-10">
          반복되는 읽기·정리 업무,
          <br />
          이제 FLOCUT이 대신합니다.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            "회의 요약 자동화",
            "문서 핵심 추출",
            "업무 기록 정리",
          ].map((item) => (
            <div
              key={item}
              className="
                p-6
                rounded-xl
                border border-border-light dark:border-border-dark
                bg-surface-light dark:bg-surface-dark
                text-sm
              "
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
