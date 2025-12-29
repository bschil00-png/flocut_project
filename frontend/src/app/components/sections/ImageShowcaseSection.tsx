"use client";

import Image from "next/image";

export default function ImageShowcaseSection() {
    return (
        <section className="w-full py-32">
            <div className="mx-auto max-w-7xl px-6">

                {/* TEXT */}
                <div className="mb-20 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        FloCut의 AI 분석 기능을
                        <br />
                        한 화면에서 확인하세요
                    </h2>
                    <p className="text-text-muted-light">
                        문서 요약, 비교, 흐름 분석까지
                        하나의 워크플로우로 제공합니다.
                    </p>
                </div>

                {/* IMAGE GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main */}
                    <div className="lg:col-span-2">
                        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-border-light">
                            <Image
                                src="/index/main.jpg"
                                alt="FloCut Main"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>

                    {/* Side */}
                    <div className="flex flex-col gap-8">
                        {["calendar", "studio"].map((name) => (
                            <div
                                key={name}
                                className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-border-light"
                            >
                                <Image
                                    src={`/index/${name}.jpg`}
                                    alt={name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    {["workspace", "mobile"].map((name) => (
                        <div
                            key={name}
                            className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-border-light"
                        >
                            <Image
                                src={`/index/${name}.jpg`}
                                alt={name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
