"use client";

import { useQuery } from "@apollo/client/react";
import {
    ADMIN_MEMBERS_QUERY,
} from "@/lib/graphql/admin/member.admin.query";
import type {
    AdminMember,
    AdminMembersQueryResult,
    AdminMembersQueryVariables,
} from "@/lib/graphql/admin/member.admin.types";

import Card from "@/app/components/ui/card/Card";
import List from "@/app/components/ui/list/List";
import ListItem from "@/app/components/ui/list/ListItem";
import StatusBadge from "@/app/components/ui/badge/StatusBadge";
import RoleBadge from "@/app/components/ui/badge/RoleBadge";
import Divider from "@/app/components/ui/divider/Divider";

import {
    updateMemberStatus,
    updateMemberRole,
} from "@/lib/rest/member/member.rest";

export default function AdminMemberList() {
    const { data, loading, error, refetch } = useQuery<
        AdminMembersQueryResult,
        AdminMembersQueryVariables
    >(ADMIN_MEMBERS_QUERY, {
        variables: { page: 0, size: 20 },
    });

    if (loading) return <div>불러오는 중...</div>;
    if (error) return <div>데이터 로딩 실패</div>;

    const members = data?.adminMembers.content ?? [];

    async function handleStatusChange(id: number, status: AdminMember["status"]) {
        await updateMemberStatus(id, { status, reason: "관리자 변경" });
        refetch();
    }

    async function handleRoleChange(id: number, role: AdminMember["role"]) {
        await updateMemberRole(id, { role, reason: "관리자 변경" });
        refetch();
    }

    return (
        <Card padding="none">
            <List>
                {members.map((m) => (
                    <div key={m.memberId} className="px-4 py-3 space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0">
                                <p className="text-sm font-medium truncate">{m.email}</p>
                                <p className="text-xs text-text-muted-light truncate">
                                    {m.name}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <RoleBadge role={m.role} />
                                <StatusBadge status={m.status} />
                            </div>
                        </div>

                        {/* 액션 영역 */}
                        <div className="flex gap-3">
                            <select
                                value={m.role}
                                onChange={(e) =>
                                    handleRoleChange(m.memberId, e.target.value as any)
                                }
                                className="text-xs border rounded-md px-2 py-1"
                            >
                                <option value="USER">USER</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>

                            <select
                                value={m.status}
                                onChange={(e) =>
                                    handleStatusChange(m.memberId, e.target.value as any)
                                }
                                className="text-xs border rounded-md px-2 py-1"
                            >
                                <option value="READY">READY</option>
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="DISABLED">DISABLED</option>
                                <option value="DELETED">DELETED</option>
                            </select>
                        </div>
                    </div>
                ))}
            </List>
        </Card>
    );
}
