export default function NoticeSection() {
    return (
        <section className="w-full py-24 bg-white">
            <div className="mx-auto max-w-7xl px-6">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold">공지사항</h3>
                    <button className="text-sm text-text-muted-light">
                        전체보기
                    </button>
                </div>

                <ul className="space-y-4 text-sm">
                    {[
                        "FloCut AI 분석 기능 업데이트 안내",
                        "문서 비교 정확도 개선 공지",
                        "AI Studio 베타 오픈 안내",
                    ].map((item) => (
                        <li
                            key={item}
                            className="flex justify-between border-b border-border-light pb-3"
                        >
                            <span>{item}</span>
                            <span className="text-text-muted-light">2025.12.10</span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
