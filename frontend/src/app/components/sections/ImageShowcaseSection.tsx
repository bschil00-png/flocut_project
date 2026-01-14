"use client";

import Image from "next/image";

export default function ImageShowcaseSection() {
    return (
        <section
            className="
        w-full py-32
        bg-gray-50
        dark:bg-background-dark
      "
        >
            <div className="mx-auto max-w-7xl px-6">

                {/* TEXT */}
                <div className="mb-20 text-center">
                    <h2
                        className="
              text-3xl md:text-4xl font-bold mb-4
              text-text-primary-light
              dark:text-text-primary-dark
            "
                    >
                        FloCut의 AI 요약 기능을 한 번<br />에 만나보세요
                    </h2>
                </div>

                {/* IMAGE GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* LEFT COLUMN */}
                    <div className="flex flex-col gap-6">

                        {/* Main */}
                        <div
                            className="
                w-full aspect-[16/10]
                rounded-3xl overflow-hidden
                bg-gray-200
                dark:bg-[#111726]
                border border-border-light
                dark:border-border-dark
              "
                        >
                            <div className="relative w-full h-full">
                                <Image
                                    src="/index/main.jpg"
                                    alt="FloCut AI-Powered Document & Audio Summarization"
                                    fill
                                    className="object-cover dark:brightness-90"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Bottom 2 */}
                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { src: "workspace", alt: "FloCut Workspace" },
                                { src: "mobile", alt: "FloCut Mobile" },
                            ].map(({ src, alt }) => (
                                <div
                                    key={src}
                                    className="
                    w-full aspect-[3/4]
                    rounded-3xl overflow-hidden
                    bg-gray-200
                    dark:bg-[#111726]
                    border border-border-light
                    dark:border-border-dark
                  "
                                >
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={`/index/${src}.jpg`}
                                            alt={alt}
                                            fill
                                            className="object-cover dark:brightness-90"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="flex flex-col gap-6">

                        {/* Calendar */}
                        <div
                            className="
                w-full aspect-[16/9]
                rounded-3xl overflow-hidden
                bg-gray-200
                dark:bg-[#111726]
                border border-border-light
                dark:border-border-dark
              "
                        >
                            <div className="relative w-full h-full">
                                <Image
                                    src="/index/calendar.jpg"
                                    alt="FloCut Calendar"
                                    fill
                                    className="object-cover dark:brightness-90"
                                />
                            </div>
                        </div>

                        {/* Studio */}
                        <div
                            className="
                w-full flex-1
                rounded-3xl overflow-hidden
                bg-gray-200
                dark:bg-[#111726]
                border border-border-light
                dark:border-border-dark
              "
                        >
                            <div className="relative w-full h-full">
                                <Image
                                    src="/index/studio.jpg"
                                    alt="FLOCUT AI Studio"
                                    fill
                                    className="object-cover dark:brightness-90"
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
