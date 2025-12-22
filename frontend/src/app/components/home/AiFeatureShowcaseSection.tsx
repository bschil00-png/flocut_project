"use client" +
""
/**
 * FloCut AI 기능 쇼케이스 섹션
 * - 피그마 레이아웃 기준 1:1 구조
 * - 이미지 없음 → 플레이스홀더 처리
 */
export default function AiFeatureShowcaseSection() {
  return (
    <section className="w-full bg-background-light dark:bg-background-dark">
      <div className="mx-auto max-w-7xl px-6 py-24">
        {/* Section Title */}
        <h2 className="text-3xl font-bold text-center mb-14">
          FloCut의 AI 요약 기능을 한 번에
          <br />
          만나보세요
        </h2>

        {/* Grid Wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ===== Left Large Card ===== */}
          <div
            className="
              rounded-2xl
              p-8
              bg-surface-light dark:bg-surface-dark
              border border-border-light dark:border-border-dark
              min-h-[360px]
              flex flex-col justify-between
            "
          >
            <div>
              <h3 className="text-xl font-semibold mb-2">FLOCUT</h3>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                AI-Powered Document & Audio Summarization
              </p>
            </div>

            {/* Image Placeholder */}
            <div
              className="
                mt-6 flex-1
                rounded-xl
                bg-background-light dark:bg-background-dark
                flex items-center justify-center
                text-xs text-text-muted-light
              "
            >
              Main Feature Image
            </div>

            <button className="mt-6 w-fit px-4 py-2 text-xs rounded-md bg-accent text-white">
              GET STARTED FOR FREE
            </button>
          </div>

          {/* ===== Right Column ===== */}
          <div className="grid grid-rows-2 gap-6">
            {/* Calendar Card */}
            <div
              className="
                rounded-2xl
                p-6
                bg-surface-light dark:bg-surface-dark
                border border-border-light dark:border-border-dark
              "
            >
              <h4 className="font-semibold mb-2">FLOCUT CALENDAR</h4>
              <p className="text-sm text-text-muted-light mb-4">
                Manage tasks, schedule events and track progress.
              </p>

              <div
                className="
                  h-28
                  rounded-lg
                  bg-background-light dark:bg-background-dark
                  flex items-center justify-center
                  text-xs text-text-muted-light
                "
              >
                Calendar Preview
              </div>
            </div>

            {/* AI Studio Card */}
            <div
              className="
                rounded-2xl
                p-6
                bg-surface-light dark:bg-surface-dark
                border border-border-light dark:border-border-dark
                flex flex-col justify-between
              "
            >
              <div>
                <h4 className="font-semibold mb-2">FLOCUT AI STUDIO</h4>
                <p className="text-sm text-text-muted-light">
                  Your intelligent AI assistant that knows your company best.
                </p>
              </div>

              <div
                className="
                  mt-4 flex-1
                  rounded-lg
                  bg-background-light dark:bg-background-dark
                  flex items-center justify-center
                  text-xs text-text-muted-light
                "
              >
                AI Studio UI
              </div>
            </div>
          </div>
        </div>

        {/* ===== Bottom Row ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Workspace Card */}
          <div
            className="
              rounded-2xl
              p-6
              bg-surface-light dark:bg-surface-dark
              border border-border-light dark:border-border-dark
            "
          >
            <h4 className="font-semibold mb-2">FLOCUT WORKSPACE</h4>
            <p className="text-sm text-text-muted-light mb-4">
              Collaborate and organize summaries in one place.
            </p>

            <div
              className="
                h-32
                rounded-lg
                bg-background-light dark:bg-background-dark
                flex items-center justify-center
                text-xs text-text-muted-light
              "
            >
              Workspace Preview
            </div>
          </div>

          {/* Mobile Preview Card */}
          <div
            className="
              rounded-2xl
              p-6
              bg-surface-light dark:bg-surface-dark
              border border-border-light dark:border-border-dark
            "
          >
            <h4 className="font-semibold mb-2">FLOCUT</h4>
            <p className="text-sm text-text-muted-light mb-4">
              AI-Powered Meeting Notes
            </p>

            <div
              className="
                h-32
                rounded-lg
                bg-background-light dark:bg-background-dark
                flex items-center justify-center
                text-xs text-text-muted-light
              "
            >
              Mobile Preview
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

