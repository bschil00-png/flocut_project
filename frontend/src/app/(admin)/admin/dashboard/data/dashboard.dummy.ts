import {
    TrendingUp,
    Users,
    FileText,
    Zap,
} from "lucide-react";

export const metrics = [
    {
        label: "총 매출",
        value: "₩54.2M",
        change: "+12.5%",
        trend: "up",
        icon: TrendingUp,
    },
    {
        label: "활성 사용자",
        value: "8,549",
        change: "+8.2%",
        trend: "up",
        icon: Users,
    },
    {
        label: "문서 수",
        value: "124.5K",
        change: "+23.1%",
        trend: "up",
        icon: FileText,
    },
    {
        label: "API 사용량",
        value: "2.4M",
        change: "-3.2%",
        trend: "down",
        icon: Zap,
    },
];

export const activities = [
    {
        type: "success",
        title: "기업 플랜 가입",
        description: "acme@company.com",
        time: "2분 전",
    },
    {
        type: "success",
        title: "문서 요약 완료",
        description: "1,234 페이지 처리",
        time: "15분 전",
    },
    {
        type: "warning",
        title: "API 사용량 경고",
        description: "85% 초과",
        time: "1시간 전",
    },
    {
        type: "error",
        title: "STT 처리 실패",
        description: "음성 변환 오류",
        time: "2시간 전",
    },
];

export const systems = [
    { name: "API Gateway", status: "OK", latency: "45ms", uptime: "99.9%" },
    { name: "Database", status: "OK", latency: "12ms", uptime: "99.8%" },
    { name: "STT Service", status: "OK", latency: "234ms", uptime: "98.5%" },
    { name: "AI Processing", status: "DEGRADED", latency: "1.2s", uptime: "97.2%" },
];
