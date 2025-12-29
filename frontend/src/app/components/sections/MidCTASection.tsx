export default function MidCTASection() {
    return (
        <section className="w-full py-24 bg-surface-light dark:bg-surface-dark">
            <div className="mx-auto max-w-7xl px-6 flex flex-col items-start gap-6">
                <h2 className="text-2xl font-bold">
                    문서 흐름 분석을 시작하세요
                </h2>
                <button className="h-11 px-8 rounded-md bg-accent text-white text-sm">
                    분석 시작하기
                </button>
            </div>
        </section>
    );
}
