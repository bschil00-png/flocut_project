/**
 * 무료 체험 유도 카드 섹션
 */
export default function FreeTrialSection() {
  return (
    <section className="w-full bg-background-light dark:bg-background-dark">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="text-3xl font-bold mb-12">무료로 체험하세요.</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="
                rounded-xl
                border border-border-light dark:border-border-dark
                bg-surface-light dark:bg-surface-dark
                p-6
              "
            >
              <div className="h-32 mb-4 bg-background-light dark:bg-background-dark rounded-lg" />
              <h3 className="font-semibold mb-2">FLOCUT 시작하기</h3>
              <button className="text-sm text-accent">바로가기</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
