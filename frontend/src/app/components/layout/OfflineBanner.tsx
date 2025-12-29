"use client";

import { useEffect, useState } from "react";

type NetworkStatus = "online" | "offline" | "reconnected";

export function OfflineBanner() {
    const [status, setStatus] = useState<NetworkStatus>("online");
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // 실제 네트워크 복구 시
        const handleOnline = () => {
            try {
                setStatus("reconnected");
                setIsVisible(true);
                setTimeout(() => setStatus("online"), 10000);
            } catch (error) {
                console.error("[OfflineBanner] handleOnline error:", error);
            }
        };

        // 실제 네트워크 끊김 시
        const handleOffline = () => {
            try {
                setStatus("offline");
                setIsVisible(true);
            } catch (error) {
                console.error("[OfflineBanner] handleOffline error:", error);
            }
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        // =====================================================
        // 테스트용 강제 트리거
        // 실서비스 배포 시 아래 블록 전체 주석 처리 또는 삭제 하면 됨
        (window as any).forceOffline = () => {
            try {
                console.log("[OfflineBanner] forceOffline");
                setStatus("offline");
                setIsVisible(true);
            } catch (error) {
                console.error("[OfflineBanner] forceOffline error:", error);
            }
        };

        (window as any).forceOnline = () => {
            try {
                console.log("[OfflineBanner] forceOnline");
                setStatus("reconnected");
                setIsVisible(true);
                setTimeout(() => setStatus("online"), 10000);
            } catch (error) {
                console.error("[OfflineBanner] forceOnline error:", error);
            }
        };
        // =====================================================

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);

            // 테스트용 트리거 정리
            delete (window as any).forceOffline;
            delete (window as any).forceOnline;
        };
    }, []);

    // 온라인 상태이거나 사용자가 닫았으면 배너 표시하지 않음
    if (status === "online" || !isVisible) return null;

    const handleClose = () => {
        setIsVisible(false);
    };

    return (
        <div
            className={`
                fixed top-0 left-0 right-0
                z-[9999]
                backdrop-blur-md
                border-b
                transition-all duration-300 ease-in-out
                ${status === "offline"
                ? "bg-amber-50/95 border-amber-200"
                : "bg-emerald-50/95 border-emerald-200"}
            `}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center gap-3 py-3 relative">
                    {/* 아이콘 */}
                    <div className={`
                        flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center
                        ${status === "offline"
                        ? "bg-amber-500"
                        : "bg-emerald-500"}
                    `}>
                        {status === "offline" ? (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>

                    {/* 메시지 */}
                    <p className={`
                        text-sm font-medium tracking-tight
                        ${status === "offline"
                        ? "text-amber-900"
                        : "text-emerald-900"}
                    `}>
                        {status === "offline"
                            ? "네트워크 연결이 끊어졌습니다"
                            : "네트워크가 복구되었습니다"}
                    </p>

                    {/* 추가 상태 표시 (오프라인일 때만) */}
                    {status === "offline" && (
                        <span className="flex items-center gap-1.5 text-xs text-amber-700">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                            </span>
                            연결 대기 중
                        </span>
                    )}

                    {/* 닫기 버튼 */}
                    <button
                        onClick={handleClose}
                        className={`
                            absolute right-0
                            flex-shrink-0 
                            p-1 rounded-md
                            transition-colors duration-200
                            hover:bg-black/5
                            focus:outline-none focus:ring-2 focus:ring-offset-1
                            ${status === "offline"
                            ? "text-amber-700 hover:text-amber-900 focus:ring-amber-500"
                            : "text-emerald-700 hover:text-emerald-900 focus:ring-emerald-500"}
                        `}
                        aria-label="배너 닫기"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}