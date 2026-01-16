"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { Users, UserCheck, UserX, Shield, Activity, ArrowRight, BarChart3, Calendar } from "lucide-react";
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ADMIN_MEMBERS_QUERY } from "@/lib/graphql/admin/member.admin.query";
import type { AdminMembersQueryResult, AdminMembersQueryVariables } from "@/lib/graphql/admin/member.admin.types";
import Card from "@/app/components/ui/card/Card";
import Button from "@/app/components/ui/button/Button";
import StatusBadge from "@/app/components/ui/badge/StatusBadge";
import RoleBadge from "@/app/components/ui/badge/RoleBadge";
import EmptyState from "@/app/components/ui/empty-state/EmptyState";

export default function AdminDashboard() {
  const router = useRouter();
  const { data, loading } = useQuery<AdminMembersQueryResult, AdminMembersQueryVariables>(ADMIN_MEMBERS_QUERY, {
    variables: { page: { page: 0, size: 100 } },
  });

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent" />
    </div>
  );

  const members = data?.adminMembers?.content ?? [];
  const totalMembers = data?.adminMembers?.totalElements ?? 0;
  const activeCount = members.filter(m => m.status === "ACTIVE").length;
  const adminCount = members.filter(m => m.role === "ADMIN").length;
  const disabledCount = members.filter(m => m.status === "DISABLED" || m.status === "DELETED").length;

  const statusData = [
    { name: "활성", value: activeCount, color: "#10b981" },
    { name: "준비", value: members.filter(m => m.status === "READY").length, color: "#6366f1" },
    { name: "비활성", value: disabledCount, color: "#f43f5e" },
  ];

  const weeklyData = [
    { name: "Mon", 가입: 4, 활성: 2 },
    { name: "Tue", 가입: 7, 활성: 5 },
    { name: "Wed", 가입: 5, 활성: 4 },
    { name: "Thu", 가입: 8, 활성: 7 },
    { name: "Fri", 가입: 12, 활성: 9 },
    { name: "Sat", 가입: 6, 활성: 5 },
    { name: "Sun", 가입: 9, 활성: 8 },
  ];

  const recentMembers = [...members].sort((a, b) => new Date(b.regdate).getTime() - new Date(a.regdate).getTime()).slice(0, 5);

  return (
    <div className="space-y-6 animate-fadeIn">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">대시보드</h1>
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">실시간 회원 데이터 및 활동 분석</p>
      </header>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "전체 회원", value: totalMembers, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "활성 회원", value: activeCount, icon: UserCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "관리자", value: adminCount, icon: Shield, color: "text-indigo-500", bg: "bg-indigo-500/10" },
          { label: "비활성", value: disabledCount, icon: UserX, color: "text-rose-500", bg: "bg-rose-500/10" },
        ].map((stat, i) => (
          <Card key={i} className="p-5 border-none shadow-sm dark:bg-surface-dark">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon size={20} />
            </div>
            <p className="text-xs font-medium text-text-muted-light dark:text-text-muted-dark mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold">{stat.value.toLocaleString()}</h3>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 차트 */}
        <Card className="lg:col-span-2 p-6 dark:bg-surface-dark border-none shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <BarChart3 size={20} className="text-accent" /> 주간 트렌드
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.05} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'currentColor', fontSize: 12}} opacity={0.6} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'currentColor', fontSize: 12}} opacity={0.6} />
                <Tooltip contentStyle={{backgroundColor: 'var(--surface-dark)', border: 'none', borderRadius: '12px', color: '#fff'}} />
                <Area type="monotone" dataKey="가입" stroke="var(--accent)" fill="url(#colorAcc)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 파이 차트 */}
        <Card className="p-6 dark:bg-surface-dark border-none shadow-sm">
          <h3 className="text-lg font-bold mb-6">회원 분포</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} innerRadius={65} outerRadius={85} paddingAngle={8} dataKey="value">
                  {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {statusData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-text-muted-light dark:text-text-muted-dark">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}} />
                  {item.name}
                </div>
                <span className="font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 목록 */}
      <Card className="p-6 dark:bg-surface-dark border-none shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Activity size={20} className="text-accent" /> 최근 가입
          </h3>
          <Button variant="ghost" size="sm" onClick={() => router.push('/admin/members')}>
            전체 보기 <ArrowRight size={14} className="ml-1" />
          </Button>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[600px] space-y-2">
            {recentMembers.map((m) => (
              <div key={m.memberId} className="flex items-center justify-between p-4 rounded-2xl bg-surface-light dark:bg-surface-hover/30 hover:bg-accent-soft/20 transition-all cursor-pointer" onClick={() => router.push(`/admin/members/${m.memberId}`)}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-accent/20">
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{m.name}</p>
                    <p className="text-[11px] text-text-muted-light">{m.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <RoleBadge role={m.role} />
                  <StatusBadge status={m.status} />
                  <span className="text-[11px] text-text-muted-light w-24 text-right">
                                        {new Date(m.regdate).toLocaleDateString()}
                                    </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}