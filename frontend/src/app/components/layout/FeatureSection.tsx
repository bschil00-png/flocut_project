
// 이후에 회사 소개?

export default function FeatureSection() {
    const features = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            title: "문서 요약",
            desc: "PDF, DOCX, TXT 파일을 업로드하면 핵심만 자동 요약합니다. 200페이지까지 지원.",
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
            ),
            title: "음성 요약",
            desc: "회의 녹음, 강의 음성을 STT로 변환하고 자동으로 요약합니다. 60분까지 처리 가능.",
            color: "from-purple-500 to-pink-500"
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            ),
            title: "문서 비교",
            desc: "여러 문서를 비교해 변경점, 공통점, 흐름 변화를 한눈에 분석합니다.",
            color: "from-orange-500 to-red-500"
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            ),
            title: "AI 피드백",
            desc: "요약본을 기반으로 논리 구조, 누락 요소를 분석하고 개선안을 제안합니다.",
            color: "from-green-500 to-emerald-500"
        }
    ];

    return (
        <section
            className="
        w-full py-24
        bg-background-light
        dark:bg-background-dark
      "
        >
            <div className="mx-auto max-w-7xl px-6">

                {/* 섹션 헤더 */}
                <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-accent-soft text-accent text-sm font-semibold mb-4">
            핵심 기능
          </span>
                    <h2
                        className="
              text-4xl md:text-5xl
              font-bold
              text-text-primary-light
              dark:text-text-primary-dark
              mb-4
            "
                    >
                        FloCut이 제공하는
                        <br />
                        AI 문서 관리 경험
                    </h2>
                    <p className="text-lg text-text-muted-light dark:text-text-muted-dark max-w-2xl mx-auto">
                        기록부터 이해, 비교, 재구성까지. 문서 처리의 전체 사이클을 하나의 플랫폼에서.
                    </p>
                </div>

                {/* 기능 카드 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="
                group relative
                rounded-2xl
                bg-surface-light
                dark:bg-surface-dark
                border border-border-light
                dark:border-border-dark
                p-8
                transition-all duration-300
                hover:shadow-2xl
                hover:-translate-y-1
                overflow-hidden
              "
                        >
                            {/* 호버 시 그래디언트 효과 */}
                            <div
                                className={`
                  absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300
                  bg-gradient-to-br ${feature.color}
                `}
                            />

                            {/* 아이콘 */}
                            <div
                                className={`
                  relative inline-flex p-3 rounded-xl mb-4
                  bg-gradient-to-br ${feature.color}
                  text-white
                  shadow-lg
                `}
                            >
                                {feature.icon}
                            </div>

                            {/* 컨텐츠 */}
                            <h3
                                className="
                  relative text-xl font-bold mb-3
                  text-text-primary-light
                  dark:text-text-primary-dark
                "
                            >
                                {feature.title}
                            </h3>
                            <p
                                className="
                  relative text-base
                  text-text-muted-light
                  dark:text-text-muted-dark
                  leading-relaxed
                "
                            >
                                {feature.desc}
                            </p>

                            {/* 화살표 아이콘 */}
                            <div className="relative mt-4 inline-flex items-center gap-2 text-accent font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                <span>자세히 보기</span>
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 추가 정보 */}
                <div className="mt-16 text-center">
                    <div className="inline-flex flex-col sm:flex-row items-center gap-8 p-6 rounded-2xl bg-accent-soft border border-accent/20">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white font-bold text-lg">
                                AI
                            </div>
                            <div className="text-left">
                                <div className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                                    GPT-4 & Claude 기반
                                </div>
                                <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
                                    최신 AI 모델로 정확한 요약 제공
                                </div>
                            </div>
                        </div>
                        <div className="w-px h-12 bg-border-light dark:bg-border-dark hidden sm:block" />
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white font-bold text-lg">
                                ∞
                            </div>
                            <div className="text-left">
                                <div className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                                    무제한 사용
                                </div>
                                <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
                                    파일 개수 제한 없이 자유롭게
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}