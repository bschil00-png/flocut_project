"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client/react";

import {
    ADMIN_MEMBER_DETAIL_QUERY,
    ADMIN_LOGIN_HISTORY_QUERY,
} from "@/lib/graphql/admin/member.admin.query";

import type {
    AdminMemberDetailQueryResult,
    AdminMemberDetailQueryVariables,
    AdminLoginHistoryQueryResult,
    AdminLoginHistoryQueryVariables,
} from "@/lib/graphql/admin/member.admin.types";

import Card from "@/app/components/ui/card/Card";
import Divider from "@/app/components/ui/divider/Divider";
import StatusBadge from "@/app/components/ui/badge/StatusBadge";
import RoleBadge from "@/app/components/ui/badge/RoleBadge";
import Button from "@/app/components/ui/button/Button";
import ConfirmDialog from "@/app/components/ui/modal/ConfirmDialog";
import Pagination from "@/app/components/ui/pagination/Pagination";

import {
    updateMemberStatus,
    updateMemberRole,
} from "@/lib/rest/member/member.rest";

import { MemberStatus, UserRole } from "@/lib/graphql/auth/auth.type";

type Props = {
    memberId: number;
};

export default function AdminMemberDetail({ memberId }: Props) {
    const router = useRouter();

    // 변경 대기 상태 (confirm 용)
    const [pendingStatus, setPendingStatus] = useState<MemberStatus | null>(null);
    const [pendingRole, setPendingRole] = useState<UserRole | null>(null);

    // 로그인 이력 페이지네이션
    const [historyPage, setHistoryPage] = useState(0);

    // 확인 다이얼로그 상태
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmType, setConfirmType] =
        useState<"STATUS" | "ROLE" | null>(null);

    // 멤버 상세 조회
    const { data, loading, refetch } = useQuery<
        AdminMemberDetailQueryResult,
        AdminMemberDetailQueryVariables
    >(ADMIN_MEMBER_DETAIL_QUERY, {
        variables: { memberId },
    });

    // 로그인 이력 조회 (페이지네이션)
    const { data: historyData } = useQuery<
        AdminLoginHistoryQueryResult,
        AdminLoginHistoryQueryVariables
    >(ADMIN_LOGIN_HISTORY_QUERY, {
        variables: {
            memberId,
            page: { page: historyPage, size: 10 },
        },
    });

    if (loading) return <Card>멤버 정보를 불러오는 중입니다.</Card>;
    if (!data) return <Card>멤버 정보를 찾을 수 없습니다.</Card>;

    const member = data.adminMember;
    const historyPageData = historyData?.adminLoginHistories;
    const histories = historyPageData?.content ?? [];

    // 변경 확정
    async function handleConfirm() {
        if (confirmType === "STATUS" && pendingStatus) {
            await updateMemberStatus(memberId, {
                status: pendingStatus,
                reason: "관리자 변경",
            });
        }

        if (confirmType === "ROLE" && pendingRole) {
            await updateMemberRole(memberId, {
                role: pendingRole,
                reason: "관리자 변경",
            });
        }

        // 상태 초기화
        setConfirmOpen(false);
        setConfirmType(null);
        setPendingStatus(null);
        setPendingRole(null);

        // 서버 기준 재조회
        refetch();
    }

    return (
        <>
            <Card className="space-y-6">
                {/* 헤더 */}
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-lg font-semibold">{member.email}</h2>
                        <p className="text-sm text-text-muted-light">{member.name}</p>
                    </div>

                    <Button variant="secondary" size="sm" onClick={() => router.back()}>
                        목록으로
                    </Button>
                </div>

                <Divider />

                {/* 기본 정보 */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-text-muted-light">회원 ID</p>
                        <p>#{member.memberId}</p>
                    </div>

                    <div>
                        <p className="text-text-muted-light">가입일</p>
                        <p>{new Date(member.regdate).toLocaleString()}</p>
                    </div>

                    <div>
                        <p className="text-text-muted-light">상태</p>
                        <StatusBadge status={member.status} />
                    </div>

                    <div>
                        <p className="text-text-muted-light">권한</p>
                        <RoleBadge role={member.role} />
                    </div>
                </div>

                <Divider />

                {/* 회원 상태 변경 */}
                <div className="space-y-2">
                    <p className="text-sm font-medium">회원 상태 변경</p>
                    <select
                        value={member.status} // 항상 서버 기준
                        onChange={(e) => {
                            setPendingStatus(e.target.value as MemberStatus);
                            setConfirmType("STATUS");
                            setConfirmOpen(true);
                        }}
                        className="border rounded-md px-3 py-2 text-sm"
                    >
                        <option value="READY">READY</option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="DISABLED">DISABLED</option>
                        <option value="DELETED">DELETED</option>
                    </select>
                </div>

                {/* 회원 권한 변경 */}
                <div className="space-y-2">
                    <p className="text-sm font-medium">회원 권한 변경</p>
                    <select
                        value={member.role} // 항상 서버 기준
                        onChange={(e) => {
                            setPendingRole(e.target.value as UserRole);
                            setConfirmType("ROLE");
                            setConfirmOpen(true);
                        }}
                        className="border rounded-md px-3 py-2 text-sm"
                    >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                </div>

                <Divider />

                {/* 로그인 이력 */}
                <div className="space-y-2">
                    <p className="text-sm font-medium">최근 로그인 이력</p>

                    {histories.length === 0 ? (
                        <p className="text-xs text-text-muted-light">
                            로그인 이력이 없습니다.
                        </p>
                    ) : (
                        <>
                            <ul className="text-xs space-y-1">
                                {histories.map((h, idx) => (
                                    <li key={idx}>
                                        {new Date(h.loginAt).toLocaleString()} / {h.ip ?? "-"} /{" "}
                                        {h.device}
                                    </li>
                                ))}
                            </ul>

                            {/* 로그인 이력 페이지네이션 */}
                            {historyPageData && (
                                <Pagination
                                    pageNumber={historyPageData.pageNumber}
                                    totalPages={historyPageData.totalPages}
                                    hasNext={historyPageData.hasNext}
                                    hasPrevious={historyPageData.hasPrevious}
                                    isFirst={historyPageData.isFirst}
                                    isLast={historyPageData.isLast}
                                    onChange={setHistoryPage}
                                />
                            )}
                        </>
                    )}
                </div>
            </Card>

            {/* 변경 확인 다이얼로그 */}
            <ConfirmDialog
                open={confirmOpen}
                title="변경 확인"
                message="정말 변경하시겠습니까?"
                confirmText="변경"
                cancelText="취소"
                onConfirm={handleConfirm}
                onClose={() => {
                    // 취소 시 즉시 원복
                    setConfirmOpen(false);
                    setConfirmType(null);
                    setPendingStatus(null);
                    setPendingRole(null);
                }}
            />
        </>
    );
}
