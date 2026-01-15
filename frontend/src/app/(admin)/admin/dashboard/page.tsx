"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import {
    Users,
    UserCheck,
    UserX,
    Shield,
    TrendingUp,
    TrendingDown,
    Activity,
    Clock,
    Mail,
    ArrowRight,
    BarChart3,
    Calendar
} from "lucide-react";

import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { ADMIN_MEMBERS_QUERY } from "@/lib/graphql/admin/member.admin.query";
import type {
    AdminMembersQueryResult,
    AdminMembersQueryVariables,
} from "@/lib/graphql/admin/member.admin.types";

import Card from "@/app/components/ui/card/Card";
import Button from "@/app/components/ui/button/Button";
import StatusBadge from "@/app/components/ui/badge/StatusBadge";
import RoleBadge from "@/app/components/ui/badge/RoleBadge";
import EmptyState from "@/app/components/ui/empty-state/EmptyState";

export default function AdminDashboard() {
    const router = useRouter();

    const { data, loading } = useQuery<
        AdminMembersQueryResult,
        AdminMembersQueryVariables
    >(ADMIN_MEMBERS_QUERY, {
        variables: {
            page: { page: 0, size: 100 },
        },
    });

    if (loading) {
        return (
            <Card className="p-8">
                <div className="flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
                </div>
            </Card>
        );
    }

    const members = data?.adminMembers?.content ?? [];
    const totalMembers = data?.adminMembers?.totalElements ?? 0;

    // 실제 데이터 기반 통계
    const activeCount = members.filter(m => m.status === "ACTIVE").length;
    const readyCount = members.filter(m => m.status === "READY").length;
    const disabledCount = members.filter(m => m.status === "DISABLED").length;
    const deletedCount = members.filter(m => m.status === "DELETED").length;
    const adminCount = members.filter(m => m.role === "ADMIN").length;

    // 상태별 파이 차트 데이터
    const statusData = [
        { name: "활성", value: activeCount, color: "#10b981" },
        { name: "준비", value: readyCount, color: "#6b7280" },
        { name: "비활성", value: disabledCount, color: "#f59e0b" },
        { name: "삭제됨", value: deletedCount, color: "#ef4444" },
    ].filter(d => d.value > 0);

    // 최근 7일 가입자 데이터 (날짜별 그룹화)
    const getLast7Days = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push({
                date: date.toISOString().split('T')[0],
                label: date.toLocaleDateString('ko-KR', { weekday: 'short' }),
            });
        }
        return days;
    };

    const last7Days = getLast7Days();
    const weeklyData = last7Days.map(day => {
        const dayMembers = members.filter(m => {
            const memberDate = new Date(m.regdate).toISOString().split('T')[0];
            return memberDate === day.date;
        });

        return {
            name: day.label,
            가입: dayMembers.length,
            활성: dayMembers.filter(m => m.status === "ACTIVE").length,
        };
    });

    // 최근 가입한 회원 5명
    const recentMembers = [...members]
        .sort((a, b) => new Date(b.regdate).getTime() - new Date(a.regdate).getTime())
        .slice(0, 5);

    return (
        <div className="space-y-6">
            {/* 헤더 */}
            <div>
                <h1 className="text-2xl font-bold mb-1">대시보드</h1>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                    회원 관리 통계 및 활동 현황
                </p>
            </div>

            {/* 주요 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-5">
                    <div className="flex items-start justify-between mb-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark mb-1">
                            전체 회원
                        </p>
                        <p className="text-2xl font-bold mb-1">{totalMembers.toLocaleString()}</p>
                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                            등록된 전체 회원 수
                        </p>
                    </div>
                </Card>

                <Card className="p-5">
                    <div className="flex items-start justify-between mb-3">
                        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                            <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                            {((activeCount / totalMembers) * 100).toFixed(1)}%
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark mb-1">
                            활성 회원
                        </p>
                        <p className="text-2xl font-bold mb-1">{activeCount.toLocaleString()}</p>
                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                            현재 활성화된 회원
                        </p>
                    </div>
                </Card>

                <Card className="p-5">
                    <div className="flex items-start justify-between mb-3">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                            <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                            {((adminCount / totalMembers) * 100).toFixed(1)}%
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark mb-1">
                            관리자
                        </p>
                        <p className="text-2xl font-bold mb-1">{adminCount.toLocaleString()}</p>
                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                            관리자 권한 보유
                        </p>
                    </div>
                </Card>

                <Card className="p-5">
                    <div className="flex items-start justify-between mb-3">
                        <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                            <UserX className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                            {(((disabledCount + deletedCount) / totalMembers) * 100).toFixed(1)}%
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark mb-1">
                            비활성 회원
                        </p>
                        <p className="text-2xl font-bold mb-1">{(disabledCount + deletedCount).toLocaleString()}</p>
                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                            비활성 + 삭제된 회원
                        </p>
                    </div>
                </Card>
            </div>

            {/* 차트 섹션 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 주간 가입 트렌드 */}
                <Card className="lg:col-span-2 p-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            주간 가입 트렌드
                        </h3>
                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                            최근 7일간 가입 및 활성화 현황
                        </p>
                    </div>

                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={weeklyData}>
                            <defs>
                                <linearGradient id="colorJoin" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f25555" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#f25555" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                            <YAxis stroke="#6b7280" fontSize={12} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '12px'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="가입"
                                stroke="#f25555"
                                fillOpacity={1}
                                fill="url(#colorJoin)"
                                strokeWidth={2}
                                name="가입 회원"
                            />
                            <Area
                                type="monotone"
                                dataKey="활성"
                                stroke="#10b981"
                                fillOpacity={1}
                                fill="url(#colorActive)"
                                strokeWidth={2}
                                name="활성 회원"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>

                {/* 상태별 분포 */}
                <Card className="p-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-1">상태별 분포</h3>
                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                            회원 상태 비율
                        </p>
                    </div>

                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>

                    <div className="mt-4 space-y-2">
                        {statusData.map((item, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-text-muted-light dark:text-text-muted-dark">
                    {item.name}
                  </span>
                                </div>
                                <span className="font-semibold">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* 최근 가입 회원 */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        최근 가입 회원
                    </h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push('/admin/members')}
                        className="gap-1"
                    >
                        전체 보기
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>

                {recentMembers.length === 0 ? (
                    <EmptyState
                        title="가입한 회원이 없습니다"
                        description="아직 등록된 회원이 없습니다"
                    />
                ) : (
                    <div className="space-y-3">
                        {recentMembers.map((member) => (
                            <div
                                key={member.memberId}
                                className="flex items-center justify-between p-4 rounded-lg bg-surface-light dark:bg-surface-dark hover:bg-accent-soft/30 cursor-pointer transition-colors"
                                onClick={() => router.push(`/admin/members/${member.memberId}`)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-accent-soft flex items-center justify-center text-accent font-semibold">
                                        {member.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{member.name}</p>
                                        <div className="flex items-center gap-1 text-xs text-text-muted-light">
                                            <Mail className="w-3 h-3" />
                                            {member.email}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 text-xs text-text-muted-light">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(member.regdate).toLocaleDateString()}
                                    </div>
                                    <RoleBadge role={member.role} />
                                    <StatusBadge status={member.status} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* 빠른 액션 */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">빠른 액션</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                        variant="secondary"
                        className="h-auto py-4 flex-col gap-2"
                        onClick={() => router.push('/admin/members')}
                    >
                        <Users className="w-6 h-6" />
                        <div className="text-center">
                            <p className="font-semibold">전체 회원 관리</p>
                            <p className="text-xs text-text-muted-light">회원 목록 및 검색</p>
                        </div>
                    </Button>

                    <Button
                        variant="secondary"
                        className="h-auto py-4 flex-col gap-2"
                    >
                        <Activity className="w-6 h-6" />
                        <div className="text-center">
                            <p className="font-semibold">활동 로그</p>
                            <p className="text-xs text-text-muted-light">회원 활동 기록</p>
                        </div>
                    </Button>

                    <Button
                        variant="secondary"
                        className="h-auto py-4 flex-col gap-2"
                    >
                        <BarChart3 className="w-6 h-6" />
                        <div className="text-center">
                            <p className="font-semibold">통계 리포트</p>
                            <p className="text-xs text-text-muted-light">상세 분석 보고서</p>
                        </div>
                    </Button>
                </div>
            </Card>
        </div>
    );
}