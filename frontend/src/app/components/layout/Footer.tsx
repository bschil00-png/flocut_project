"use client";

import { Github, Mail, Linkedin } from "lucide-react";

export default function Footer() {
    const productLinks = ["문서 요약", "음성 요약", "문서 비교", "AI 피드백", "가격 안내"];
    const companyLinks = ["회사 소개", "공지사항", "채용", "파트너십", "문의하기"];
    const socialLinks = [
        { icon: Github, label: "Github", href: "#" },
        { icon: Mail, label: "Email", href: "mailto:flocut2026@gmail.com" },
        { icon: Linkedin, label: "LinkedIn", href: "#" }
    ];

    return (
        <footer className="w-full bg-surface-light dark:bg-surface-dark border-t border-border-light dark:border-border-dark">
            <div className="mx-auto max-w-7xl px-6 py-16">
                {/* 상단 영역 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* 회사 정보 */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                                FLOCUT
                            </span>
                        </div>

                        <p className="text-base text-text-muted-light dark:text-text-muted-dark leading-relaxed max-w-md">
                            문서의 흐름을 정리해 핵심만 남기는 AI 요약 플랫폼.
                            <br />
                            학습과 업무의 효율을 극대화하세요.
                        </p>

                        {/* 소셜 링크 */}
                        <div className="flex items-center gap-3 pt-2">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        className="w-10 h-10 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark flex items-center justify-center text-text-muted-light dark:text-text-muted-dark hover:border-accent hover:text-accent hover:shadow-lg hover:shadow-accent/10 transition-all"
                                        aria-label={social.label}
                                    >
                                        <Icon size={18} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* 제품 링크 */}
                    <div>
                        <h4 className="font-bold text-text-primary-light dark:text-text-primary-dark mb-6">
                            제품
                        </h4>
                        <ul className="space-y-3">
                            {productLinks.map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="group flex items-center gap-2 text-sm text-text-muted-light dark:text-text-muted-dark hover:text-accent transition-colors"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-text-muted-light dark:bg-text-muted-dark group-hover:bg-accent transition-colors" />
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 회사 링크 */}
                    <div>
                        <h4 className="font-bold text-text-primary-light dark:text-text-primary-dark mb-6">
                            회사
                        </h4>
                        <ul className="space-y-3">
                            {companyLinks.map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="group flex items-center gap-2 text-sm text-text-muted-light dark:text-text-muted-dark hover:text-accent transition-colors"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-text-muted-light dark:bg-text-muted-dark group-hover:bg-accent transition-colors" />
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* 구분선 */}
                <div className="border-t border-border-light dark:border-border-dark mb-8" />

                {/* 하단 영역 */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* 회사 정보 텍스트 */}
                    <div className="text-xs text-text-muted-light dark:text-text-muted-dark space-y-1 text-center md:text-left">
                        <p>상호: 주식회사 플로컷 | 대표: 플로컷 팀</p>
                        <p>주소: 서울특별시 구로구 디지털로 | 이메일: flocut2025@gmail.com</p>
                    </div>

                    {/* 법적 링크 */}
                    <div className="flex items-center gap-6 text-xs">
                        {["이용약관", "개인정보 처리방침"].map((item) => (
                            <a
                                key={item}
                                href="#"
                                className="text-text-muted-light dark:text-text-muted-dark hover:text-accent transition-colors font-medium"
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>

                {/* 카피라이트 */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                        © 2026 FLOCUT. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}