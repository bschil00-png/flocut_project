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
    Trash2,
    Edit,
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

    // 페이지네이션
    const [page, setPage] = useState(0);

    // 정렬
    const [sort, setSort] = useState<"LATEST" | "OLDEST">("LATEST");

    // 필터
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [roleFilter, setRoleFilter] = useState<string>("ALL");

    // 검색
    const [searchQuery, setSearchQuery] = useState("");

    // 체크박스 선택
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const { data, loading, error } = useQuery<
        AdminMembersQueryResult,
        AdminMembersQueryVariables
    >(ADMIN_MEMBERS_QUERY, {
        variables: {
            page: { page, size: 20 },
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

    if (error) {
        return (
            <Card className="p-8">
                <EmptyState
                    title="데이터를 불러올 수 없습니다"
                    description="잠시 후 다시 시도해주세요"
                />
            </Card>
        );
    }

    const pageData = data?.adminMembers;
    const members = pageData?.content ?? [];

    // 필터링 & 검색 & 정렬
    const filteredMembers = members
        .filter(m => {
            if (statusFilter !== "ALL" && m.status !== statusFilter) return false;
            if (roleFilter !== "ALL" && m.role !== roleFilter) return false;
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return m.email.toLowerCase().includes(query) ||
                    m.name.toLowerCase().includes(query);
            }
            return true;
        })
        .sort((a, b) => {
            if (sort === "LATEST") {
                return new Date(b.regdate).getTime() - new Date(a.regdate).getTime();
            }
            return new Date(a.regdate).getTime() - new Date(b.regdate).getTime();
        });

    const allSelected = filteredMembers.length > 0 &&
        selectedIds.length === filteredMembers.length;

    const toggleAll = () => {
        if (allSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredMembers.map(m => m.memberId));
        }
    };

    return (
        <div className="space-y-4">
            {/* 헤더 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                                전체 회원
                            </p>
                            <p className="text-xl font-bold">{pageData?.totalElements ?? 0}</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                            <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                                활성 회원
                            </p>
                            <p className="text-xl font-bold">
                                {members.filter(m => m.status === "ACTIVE").length}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                            <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                                관리자
                            </p>
                            <p className="text-xl font-bold">
                                {members.filter(m => m.role === "ADMIN").length}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                            <UserX className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                                비활성 회원
                            </p>
                            <p className="text-xl font-bold">
                                {members.filter(m => m.status === "DISABLED" || m.status === "DELETED").length}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* 컨트롤 바 */}
            <Card padding="none">
                <div className="p-4 space-y-4">
                    {/* 검색 & 필터 & 정렬 */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* 검색 - 공용 컴포넌트 사용 */}
                        <div className="flex-1">
                            <SearchInput
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder="이메일 또는 이름으로 검색..."
                            />
                        </div>

                        {/* 필터 - 공용 컴포넌트 사용 */}
                        <FilterDropdown
                            label="상태"
                            value={statusFilter}
                            options={[
                                { value: "ALL", label: "전체" },
                                { value: "READY", label: "준비" },
                                { value: "ACTIVE", label: "활성" },
                                { value: "DISABLED", label: "비활성" },
                                { value: "DELETED", label: "삭제됨" },
                            ]}
                            onChange={setStatusFilter}
                        />

                        <FilterDropdown
                            label="권한"
                            value={roleFilter}
                            options={[
                                { value: "ALL", label: "전체" },
                                { value: "USER", label: "사용자" },
                                { value: "ADMIN", label: "관리자" },
                            ]}
                            onChange={setRoleFilter}
                        />

                        {/* 정렬 - 공용 컴포넌트 사용 */}
                        <ToggleGroup
                            value={sort}
                            onChange={(v) => setSort(v as any)}
                            options={[
                                {
                                    value: "LATEST",
                                    label: "최신순",
                                    icon: <SortDesc className="w-4 h-4" />
                                },
                                {
                                    value: "OLDEST",
                                    label: "오래된순",
                                    icon: <SortAsc className="w-4 h-4" />
                                },
                            ]}
                            size="sm"
                        />

                        {/* 액션 버튼 */}
                        <Button variant="secondary" size="sm" className="gap-2">
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">내보내기</span>
                        </Button>
                    </div>

                    {/* 선택된 항목 액션바 */}
                    {selectedIds.length > 0 && (
                        <div className="flex items-center justify-between p-3 rounded-lg bg-accent-soft border border-accent/20">
                            <span className="text-sm font-medium text-accent">
                                {selectedIds.length}개 선택됨
                            </span>
                            <div className="flex gap-2">
                                <Button variant="secondary" size="xs" className="gap-1">
                                    <Edit className="w-3 h-3" />
                                    일괄 수정
                                </Button>
                                <Button variant="danger" size="xs" className="gap-1">
                                    <Trash2 className="w-3 h-3" />
                                    일괄 삭제
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 테이블 */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-y border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
                        <tr>
                            <th className="w-12 px-4 py-3">
                                <Checkbox
                                    checked={allSelected}
                                    onChange={toggleAll}
                                />
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-text-muted-light">
                                No
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-text-muted-light">
                                회원 정보
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-text-muted-light">
                                권한
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-text-muted-light">
                                상태
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-text-muted-light">
                                가입일
                            </th>
                            <th className="w-12 px-4 py-3"></th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-border-dark">
                        {filteredMembers.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-12">
                                    <EmptyState
                                        icon={<Users className="w-12 h-12" />}
                                        title="검색 결과가 없습니다"
                                        description="다른 검색어나 필터를 시도해보세요"
                                    />
                                </td>
                            </tr>
                        ) : (
                            filteredMembers.map((member, index) => {
                                const checked = selectedIds.includes(member.memberId);

                                return (
                                    <tr
                                        key={member.memberId}
                                        className="hover:bg-surface-light dark:hover:bg-surface-dark cursor-pointer transition-colors"
                                        onClick={() => router.push(`/admin/members/${member.memberId}`)}
                                    >
                                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                            <Checkbox
                                                checked={checked}
                                                onChange={(v) => {
                                                    setSelectedIds((prev) =>
                                                        v
                                                            ? [...prev, member.memberId]
                                                            : prev.filter((id) => id !== member.memberId)
                                                    );
                                                }}
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-sm text-text-muted-light">
                                            {page * 20 + index + 1}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-accent-soft flex items-center justify-center text-accent font-semibold">
                                                    {member.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {member.name}
                                                    </p>
                                                    <div className="flex items-center gap-1 text-xs text-text-muted-light">
                                                        <Mail className="w-3 h-3" />
                                                        {member.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <RoleBadge role={member.role} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={member.status} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1 text-sm text-text-muted-light">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(member.regdate).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                            <button className="p-1 rounded hover:bg-surface-light dark:hover:bg-surface-hover transition-colors">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                </div>

                {/* 페이지네이션 */}
                {pageData && filteredMembers.length > 0 && (
                    <div className="p-4 border-t border-border-light dark:border-border-dark">
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