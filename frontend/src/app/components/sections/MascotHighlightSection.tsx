/**
 * 마스코트 강조 섹션
 * 핑크톤 배경 + 설명 텍스트
 */
export default function MascotHighlightSection() {
  return (
    <section className="w-full bg-accent-soft dark:bg-accent/10">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div
            className="
              w-48 h-48
              rounded-full
              bg-background-light
              flex items-center justify-center
              text-sm text-text-muted-light
            "
          >
            Mascot Image
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">
              흩어진 기록이 하나로 모이고,
              <br />
              모든 정리가 한 번에 끝납니다.
            </h2>
            <p className="text-text-muted-light">
              문서와 음성 요약을 기반으로
              작업 흐름을 자연스럽게 정리합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
