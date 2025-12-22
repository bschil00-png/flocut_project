"use client";
/**
 * VisualSection
 *
 * - 제품 실제 사용 화면을 보여주는 영역
 * - 지금은 더미 박스
 * - 나중에 대시보드 이미지 / 애니메이션 교체
 */
export default function VisualSection() {
  return (
    <section className="w-full bg-background-light dark:bg-background-dark">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* 텍스트 설명 */}
          <div>
            <h2
              className="
                text-3xl font-bold mb-4
                text-text-primary-light
                dark:text-text-primary-dark
              "
            >
              복잡한 문서도,
              <br />
              흐름이 보이게
            </h2>
            <p
              className="
                text-text-muted-light
                dark:text-text-muted-dark
              "
            >
              요약, 비교, 피드백까지
              하나의 화면에서 자연스럽게 이어집니다.
            </p>
          </div>

          {/* 비주얼 더미 */}
          <div
            className="
              h-64 rounded-xl
              bg-surface-light
              dark:bg-surface-dark
              border border-border-light
              dark:border-border-dark
              flex items-center justify-center
              text-text-muted-light
              dark:text-text-muted-dark
            "
          >
            Product Preview
          </div>
        </div>
      </div>
    </section>
  );
}
