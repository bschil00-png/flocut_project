export default function FlowExplainSection() {
    return (
        <section className="w-full py-28 bg-surface-light dark:bg-surface-dark">
            <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-20">

                {/* Left */}
                <div>
                    <h2 className="text-3xl font-bold mb-6">
                        문서 분석은
                        <br />
                        이렇게 진행됩니다
                    </h2>

                    <p className="text-text-muted-light max-w-md">
                        FloCut은 단순 요약이 아니라,
                        문서를 구조적으로 분해하고
                        비교 가능한 정보로 재구성합니다.
                    </p>
                </div>

                {/* Right – Pipeline */}
                <div className="border border-border-light dark:border-border-dark rounded-xl p-6 bg-background-light dark:bg-background-dark">
                    <ul className="space-y-4 text-sm">
                        <li>1. 문서 / 음성 입력</li>
                        <li>2. 핵심 요약 추출</li>
                        <li>3. 문서 간 변화 비교</li>
                        <li>4. 누락 및 흐름 분석</li>
                        <li>5. 판단 가능한 결과 제공</li>
                    </ul>
                </div>

            </div>
        </section>
    );
}
