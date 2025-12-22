/**
 * MidCTASection
 *
 * - 랜딩 중간 전환 유도
 * - 과하지 않게, 명확하게
 */
export default function MidCTASection() {
  return (
    <section
      className="
        w-full
        bg-surface-light
        dark:bg-surface-dark
      "
    >
      <div className="mx-auto max-w-7xl px-6 py-24 text-center">
        <h2
          className="
            text-3xl font-bold mb-6
            text-text-primary-light
            dark:text-text-primary-dark
          "
        >
          지금 바로 무료로 시작해보세요
        </h2>

        <button
          className="
            h-11 px-8
            rounded-md
            bg-accent
            hover:bg-accent-hover
            text-white
            text-sm font-medium
          "
        >
          FLOCUT 시작하기
        </button>
      </div>
    </section>
  );
}
