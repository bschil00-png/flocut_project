/**
 * Footer 컴포넌트
 *
 * - 정보형 SaaS 푸터
 * - 색상은 헤더와 동일한 토큰 사용
 * - 구조는 고정, 내용만 교체 가능
 */
export default function Footer() {
  return (
    <footer
      className="
        w-full
        bg-white
        border-t border-gray-200
        dark:bg-surface-dark
        dark:border-border-dark

      "
    >
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* 상단 영역 */}
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* 회사 정보 */}
          <div className="space-y-3">
            <div
              className="
                text-lg font-bold
                text-text-primary-light
                dark:text-text-primary-dark
              "
            >
              FLOCUT
            </div>

            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
              상호: 주식회사 플로컷 / 대표: 플로컷 팀
            </p>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
              주소: 서울특별시 구로구 디지털로
            </p>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
              이메일: flocut2026@gmail.com
            </p>
          </div>

          {/* 링크 영역 */}
          <div className="flex flex-col gap-3">
            {["회사 소개", "공지사항", "이용약관", "개인정보 처리방침", "고객센터"].map(
              (item) => (
                <span
                  key={item}
                  className="
                    text-sm cursor-pointer
                    text-text-muted-light
                    dark:text-text-muted-dark
                    hover:text-text-primary-light
                    dark:hover:text-text-primary-dark
                  "
                >
                  {item}
                </span>
              )
            )}
          </div>
        </div>

        {/* 하단 영역 */}
        <div
          className="
            mt-10
            flex flex-col md:flex-row
            justify-between items-center
            gap-4
            text-xs
            text-text-muted-light
            dark:text-text-muted-dark
          "
        >
          <span>© 2026 FLOCUT. All rights reserved.</span>

          {/* 언어 / SNS 영역 (아이콘은 추후 교체) */}
          <div className="flex items-center gap-4">
            <span>한국어</span>
            <span>Github</span>
            <span>Instagram</span>
            <span>LinkedIn</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
