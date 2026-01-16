"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import {
  Users,
  Download,
  UserCheck,
  UserX,
  Shield,
  MoreVertical,
  Mail,
  Calendar,
  SortAsc,
  SortDesc
} from "lucide-react";

import { ADMIN_MEMBERS_QUERY } from "@/lib/graphql/admin/member.admin.query";
import type {
  AdminMembersQueryResult,
  AdminMembersQueryVariables,
} from "@/lib/graphql/admin/member.admin.types";

import Card from "@/app/components/ui/card/Card";
import StatusBadge from "@/app/components/ui/badge/StatusBadge";
import RoleBadge from "@/app/components/ui/badge/RoleBadge";
import Pagination from "@/app/components/ui/pagination/Pagination";
import Button from "@/app/components/ui/button/Button";
import EmptyState from "@/app/components/ui/empty-state/EmptyState";
import Checkbox from "@/app/components/ui/form/Checkbox";
import FilterDropdown from "@/app/components/ui/filter/FilterDropdown";
import ToggleGroup from "@/app/components/ui/toggle/ToggleGroup";
import SearchInput from "@/app/components/ui/input/SearchInput";

export default function AdminMemberList() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<"LATEST" | "OLDEST">("LATEST");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { data, loading, error } = useQuery<
    AdminMembersQueryResult,
    AdminMembersQueryVariables
  >(ADMIN_MEMBERS_QUERY, {
    variables: { page: { page, size: 20 } },
  });

  if (loading) return (
    <div className="py-20 flex justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent" />
    </div>
  );

  if (error) return (
    <Card className="p-8 bg-white dark:bg-surface-dark border-border-light dark:border-border-dark">
      <EmptyState title="데이터 오류" description="잠시 후 다시 시도해주세요" />
    </Card>
  );

  const pageData = data?.adminMembers;
  const members = pageData?.content ?? [];

  const filteredMembers = members.filter(m => {
    if (statusFilter !== "ALL" && m.status !== statusFilter) return false;
    if (roleFilter !== "ALL" && m.role !== roleFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return m.email.toLowerCase().includes(query) || m.name.toLowerCase().includes(query);
    }
    return true;
  }).sort((a, b) => sort === "LATEST"
    ? new Date(b.regdate).getTime() - new Date(a.regdate).getTime()
    : new Date(a.regdate).getTime() - new Date(b.regdate).getTime());

  const toggleAll = () => {
    if (selectedIds.length === filteredMembers.length) setSelectedIds([]);
    else setSelectedIds(filteredMembers.map(m => m.memberId));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 통계 섹션 - 다크모드 배경색 심화 및 텍스트 명도 조절 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "전체", value: pageData?.totalElements ?? 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "활성", value: members.filter(m => m.status === "ACTIVE").length, icon: UserCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "관리자", value: members.filter(m => m.role === "ADMIN").length, icon: Shield, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "정지", value: members.filter(m => m.status === "DISABLED").length, icon: UserX, color: "text-rose-500", bg: "bg-rose-500/10" },
        ].map((s, i) => (
          <Card key={i} className="p-4 border-none shadow-sm bg-white dark:bg-surface-dark transition-all hover:ring-1 hover:ring-accent/20">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${s.bg} ${s.color}`}><s.icon size={20} /></div>
              <div>
                <p className="text-[10px] text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider font-bold">
                  {s.label}
                </p>
                <p className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  {s.value.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 필터 & 테이블 바디 - 다크모드 가로줄과 헤더 가독성 대폭 강화 */}
      <Card padding="none" className="bg-white dark:bg-surface-dark border border-border-light dark:border-white/5 shadow-sm overflow-hidden">
        <div className="p-4 flex flex-col xl:flex-row gap-4 bg-white dark:bg-surface-dark">
          <div className="flex-1">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="이메일 또는 이름 검색..."
              className="bg-white dark:bg-surface-input border-border-light dark:border-white/10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterDropdown
              label="상태"
              value={statusFilter}
              options={[
                {value:"ALL", label:"전체 상태"},
                {value:"ACTIVE", label:"활성"},
                {value:"READY", label:"준비"},
                {value:"DISABLED", label:"비활성"},
                {value:"DELETED", label:"삭제됨"}
              ]}
              onChange={setStatusFilter}
            />
            <FilterDropdown
              label="권한"
              value={roleFilter}
              options={[
                {value:"ALL", label:"전체 권한"},
                {value:"USER", label:"사용자"},
                {value:"ADMIN", label:"관리자"}
              ]}
              onChange={setRoleFilter}
            />
            {/* 정렬 버튼 - 다크모드 활성화 배경색 보정 */}
            <ToggleGroup
              value={sort}
              onChange={(v) => setSort(v as any)}
              options={[
                {value:"LATEST", label:"최신", icon:<SortDesc size={14}/>},
                {value:"OLDEST", label:"과거", icon:<SortAsc size={14}/>}
              ]}
              className="bg-surface-light dark:bg-white/5"
            />
            <Button variant="secondary" size="sm" className="hidden sm:flex gap-2 border-border-light dark:border-white/10">
              <Download size={14} /> 내보내기
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm">
            <thead className="bg-surface-light dark:bg-white/[0.03] border-y border-border-light dark:border-white/10">
            <tr className="text-text-muted-light dark:text-white/50 font-bold">
              <th className="px-6 py-4 w-10 text-center">
                <Checkbox checked={selectedIds.length === filteredMembers.length && filteredMembers.length > 0} onChange={toggleAll} />
              </th>
              <th className="px-6 py-4 text-left">회원 정보</th>
              <th className="px-6 py-4 hidden md:table-cell text-left font-semibold">가입일</th>
              <th className="px-6 py-4 text-left font-semibold">상태</th>
              <th className="px-6 py-4 text-right pr-10 font-semibold">관리</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-white/5">
            {filteredMembers.length === 0 ? (
              <tr><td colSpan={5} className="py-20 text-center"><EmptyState title="검색 결과 없음" description="필터를 변경해보세요" /></td></tr>
            ) : (
              filteredMembers.map((m, idx) => (
                <tr
                  key={m.memberId}
                  className="hover:bg-surface-light dark:hover:bg-white/[0.02] cursor-pointer transition-colors group"
                  onClick={() => router.push(`/admin/members/${m.memberId}`)}
                >
                  <td className="px-6 py-4 text-center" onClick={e => e.stopPropagation()}>
                    <Checkbox checked={selectedIds.includes(m.memberId)} onChange={(v) => setSelectedIds(v ? [...selectedIds, m.memberId] : selectedIds.filter(id => id !== m.memberId))} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold shadow-sm ring-2 ring-white/5">
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-text-primary-light dark:text-white/90">{m.name}</p>
                          <RoleBadge role={m.role} />
                        </div>
                        <p className="text-[11px] text-text-muted-light dark:text-white/40">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-text-muted-light dark:text-white/40 text-xs font-medium">
                    {new Date(m.regdate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={m.status} />
                  </td>
                  <td className="px-6 py-4 text-right pr-10" onClick={e => e.stopPropagation()}>
                    <button className="p-2 text-text-muted-light dark:text-white/30 hover:bg-surface-light dark:hover:bg-white/10 rounded-lg transition-colors group-hover:text-text-primary-light dark:group-hover:text-white/80">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>

        {pageData && filteredMembers.length > 0 && (
          <div className="p-6 border-t border-border-light dark:border-white/10 flex justify-center bg-white dark:bg-surface-dark">
            <Pagination
              pageNumber={pageData.pageNumber}
              totalPages={pageData.totalPages}
              hasNext={pageData.hasNext}
              hasPrevious={pageData.hasPrevious}
              isFirst={pageData.isFirst}
              isLast={pageData.isLast}
              onChange={setPage}
            />
          </div>
        )}
      </Card>
    </div>
  );
}