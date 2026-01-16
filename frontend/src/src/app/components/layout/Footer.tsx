"use client";

import Link from "next/link";
import { useState } from "react"; // 상태 관리 추가
import { Github, Mail } from "lucide-react";
import ContactModal from "@/app/components/support/ContactModal"; // 모달 임포트

export default function Footer() {
    const [isContactModalOpen, setIsContactModalOpen] = useState(false); // 모달 상태 추가

    const socialLinks = [
        {
            icon: Github,
            label: "Github",
            href: "https://github.com/bschil00-png/flocut_project"
        },
        {
            icon: Mail,
            label: "Email",
            href: "mailto:kysy0116@gmail.com"
        }
    ];

    const productLinks = ["문서 요약", "음성 요약", "문서 비교"];

    const companyLinks = [
        { label: "회사 소개", href: "/about" },
        { label: "공지사항", href: "/support" },
    ];

    return (
        <footer className="w-full bg-surface-light dark:bg-surface-dark border-t border-border-light dark:border-border-dark transition-colors">
            <div className="mx-auto max-w-7xl px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="md:col-span-2 space-y-6">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark tracking-tighter">
                                FLOCUT
                            </span>
                        </div>
                        <p className="text-base text-text-muted-light dark:text-text-muted-dark leading-relaxed max-w-md font-medium">
                            문서의 흐름을 정리해 핵심만 남기는 AI 요약 플랫폼.
                            <br />
                            학습과 업무의 효율을 극대화하세요.
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-xl bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark flex items-center justify-center text-text-muted-light dark:text-text-muted-dark hover:border-accent hover:text-accent hover:shadow-xl hover:shadow-accent/5 transition-all"
                                    >
                                        <Icon size={18} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark mb-6 uppercase tracking-widest">
                            제품
                        </h4>
                        <ul className="space-y-4">
                            {productLinks.map((item) => (
                                <li key={item}>
                                    <span className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark cursor-default">
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark mb-6 uppercase tracking-widest">
                            회사
                        </h4>
                        <ul className="space-y-4">
                            {companyLinks.map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:text-accent transition-colors">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                            {/* 문의하기 버튼: 클릭 시 모달 열림 */}
                            <li>
                                <button
                                    onClick={() => setIsContactModalOpen(true)}
                                    className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:text-accent transition-colors"
                                >
                                    문의하기
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border-light dark:border-border-dark mb-8" />

                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-[11px] font-bold text-text-muted-light dark:text-text-muted-dark space-y-1.5 text-center md:text-left  tracking-wider">
                        <p>상호: 주식회사 플로컷 | 대표: FLOCUT 팀</p>
                        <p>주소: 서울특별시 구로구 디지털로 | 이메일: flocut2025@gmail.com</p>
                    </div>

                    <div className="flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest">
                        <Link href="/terms" className="text-text-muted-light dark:text-text-muted-dark hover:text-accent transition-colors">
                            이용약관
                        </Link>
                        <Link href="/privacy" className="text-text-muted-light dark:text-text-muted-dark hover:text-accent transition-colors">
                            개인정보 처리방침
                        </Link>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-[10px] font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-[0.2em]">
                        © 2026 FLOCUT. All rights reserved.
                    </p>
                </div>
            </div>

            {/* 문의하기 모달 컴포넌트 배치 */}
            <ContactModal
                open={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
            />
        </footer>
    );
}