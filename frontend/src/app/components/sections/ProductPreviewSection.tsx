/**
 * 메인 히어로 하단
 * 실제 서비스 화면을 보여주는 영역
 * 현재는 플레이스홀더 이미지 사용
 */
export default function ProductPreviewSection() {
  return (
    <section className="w-full bg-background-light dark:bg-background-dark">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-2xl border border-border-light dark:border-border-dark overflow-hidden">
          <div
            className="
              h-[420px]
              bg-surface-light dark:bg-surface-dark
              flex items-center justify-center
              text-text-muted-light dark:text-text-muted-dark
            "
          >
            Product Dashboard Image Placeholder
          </div>
        </div>
      </div>
    </section>
  );
}
