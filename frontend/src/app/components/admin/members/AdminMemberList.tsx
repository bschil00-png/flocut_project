"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client/react";

import { ADMIN_MEMBERS_QUERY } from "@/lib/graphql/admin/member.admin.query";
import type {
    AdminMembersQueryResult,
    AdminMembersQueryVariables,
} from "@/lib/graphql/admin/member.admin.types";

import Card from "@/app/components/ui/card/Card";
import StatusBadge from "@/app/components/ui/badge/StatusBadge";
import RoleBadge from "@/app/components/ui/badge/RoleBadge";
import Pagination from "@/app/components/ui/pagination/Pagination";
import ToggleGroup from "@/app/components/ui/toggle/ToggleGroup";
import EmptyState from "@/app/components/ui/empty-state/EmptyState";
import Checkbox from "@/app/components/ui/form/Checkbox";

export default function AdminMemberList() {
    const router = useRouter();

    // 페이지네이션
    const [page, setPage] = useState(0);

    // 정렬
    const [sort, setSort] = useState<"LATEST" | "OLDEST">("LATEST");

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

    if (loading) return <Card>불러오는 중입니다.</Card>;
    if (error) return <Card>멤버 목록을 불러오지 못했습니다.</Card>;

    const pageData = data?.adminMembers;
    const members = pageData?.content ?? [];

    // 정렬은 프론트에서만 처리
    const sortedMembers = [...members].sort((a, b) => {
        if (sort === "LATEST") {
            return new Date(b.regdate).getTime() - new Date(a.regdate).getTime();
        }
        return new Date(a.regdate).getTime() - new Date(b.regdate).getTime();
    });

    return (
        <Card padding="none">
            {/* 상단 컨트롤 */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <ToggleGroup
                    value={sort}
                    onChange={(v) => setSort(v as any)}
                    options={[
                        { value: "LATEST", label: "최신 가입순" },
                        { value: "OLDEST", label: "오래된 가입순" },
                    ]}
                    size="sm"
                />

                <span className="text-xs text-text-muted-light">
          총 {pageData?.totalElements ?? 0}명
        </span>
            </div>

            {/* 테이블 헤더 */}
            <div className="grid grid-cols-[40px_60px_120px_1fr_120px_120px_140px] gap-2 px-4 py-2 text-xs text-text-muted-light border-b">
                <div />
                <div>No</div>
                <div>ID</div>
                <div>이메일 / 이름</div>
                <div>권한</div>
                <div>상태</div>
                <div>가입일</div>
            </div>

            {/* 테이블 바디 */}
            {sortedMembers.length === 0 ? (
                <EmptyState title="멤버가 없습니다" />
            ) : (
                sortedMembers.map((member, index) => {
                    const checked = selectedIds.includes(member.memberId);

                    return (
                        <div
                            key={member.memberId}
                            className="grid grid-cols-[40px_60px_120px_1fr_120px_120px_140px] gap-2 px-4 py-3 text-sm border-b hover:bg-accent-soft/30 cursor-pointer"
                            onClick={() =>
                                router.push(`/admin/members/${member.memberId}`)
                            }
                        >
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

                            <div>{page * 20 + index + 1}</div>
                            <div className="text-text-muted-light">
                                #{member.memberId}
                            </div>

                            <div className="min-w-0">
                                <p className="font-medium truncate">{member.email}</p>
                                <p className="text-xs text-text-muted-light truncate">
                                    {member.name}
                                </p>
                            </div>

                            <RoleBadge role={member.role} />
                            <StatusBadge status={member.status} />

                            <div className="text-xs">
                                {new Date(member.regdate).toLocaleDateString()}
                            </div>
                        </div>
                    );
                })
            )}

            {/* 페이지네이션 */}
            {pageData && (
                <Pagination
                    pageNumber={pageData.pageNumber}
                    totalPages={pageData.totalPages}
                    hasNext={pageData.hasNext}
                    hasPrevious={pageData.hasPrevious}
                    isFirst={pageData.isFirst}
                    isLast={pageData.isLast}
                    onChange={setPage}
                />
            )}
        </Card>
    );
}
