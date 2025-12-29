export default function ReplaceWorkSection() {
    return (
        <section className="w-full py-28">
            <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-20">

                {/* Left */}
                <div>
                    <h2 className="text-3xl font-bold mb-6">
                        이런 상황에서
                        <br />
                        FloCut이 필요합니다
                    </h2>

                    <p className="text-text-muted-light max-w-md">
                        회의록, 보고서, 기획 문서처럼
                        여러 문서를 반복해서 검토해야 하는 업무에
                        FloCut은 분석 도구로 작동합니다.
                    </p>
                </div>

                {/* Right */}
                <div className="space-y-4 text-sm">
                    <div>• 회차별 문서 변경점 검토</div>
                    <div>• 회의 내용 흐름 비교</div>
                    <div>• 보고서 논점 누락 확인</div>
                    <div>• 팀 공유용 분석 결과 생성</div>
                </div>

            </div>
        </section>
    );
}
