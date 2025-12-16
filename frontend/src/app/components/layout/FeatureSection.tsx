/**
 * FeatureSection
 *
 * - 서비스 핵심 기능 요약
 * - 카드형 레이아웃
 * - 히어로 다음에 바로 이어짐
 */
export default function FeatureSection() {
  return (
    <section
      className="
        w-full
        bg-surface-light
        dark:bg-surface-dark
      "
    >
      <div className="mx-auto max-w-7xl px-6 py-24">
        {/* 섹션 타이틀 */}
        <div className="text-center mb-14">
          <h2
            className="
              text-3xl md:text-4xl
              font-bold
              text-text-primary-light
              dark:text-text-primary-dark
            "
          >
            FloCut의 AI 요약 기능을
            <br />
            한 번에 만나보세요
          </h2>
        </div>

        {/* 카드 영역 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "문서 요약",
              desc: "PDF, 문서 파일을 업로드하면 핵심만 자동 요약합니다.",
            },
            {
              title: "음성 요약",
              desc: "회의 녹음, 강의 음성을 텍스트로 변환하고 요약합니다.",
            },
            {
              title: "문서 비교",
              desc: "여러 문서를 비교해 변경점과 흐름을 한눈에 보여줍니다.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="
                group
                rounded-xl
                bg-background-light
                dark:bg-background-dark
                border border-border-light
                dark:border-border-dark
                p-6
                transition-all
                hover:-translate-y-1
                hover:shadow-lg
                hover:border-accent-main/40
              "
            >
              <h3
                className="
                  text-lg font-semibold mb-2
                  text-text-primary-light
                  dark:text-text-primary-dark
                  group-hover:text-accent-main
                  transition-colors
                "
              >
                {item.title}
              </h3>
              <p
                className="
                  text-sm
                  text-text-muted-light
                  dark:text-text-muted-dark
                "
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
