"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import {
    ArrowLeft,
    Mail,
    Calendar,
    Shield,
    Activity,
    MapPin,
    Globe,
    Clock,
    Edit,
    Trash2,
    Ban,
    CheckCircle
} from "lucide-react";

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

    const [pendingStatus, setPendingStatus] = useState<MemberStatus | null>(null);
    const [pendingRole, setPendingRole] = useState<UserRole | null>(null);
    const [historyPage, setHistoryPage] = useState(0);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmType, setConfirmType] = useState<"STATUS" | "ROLE" | null>(null);

    const { data, loading, refetch } = useQuery<
        AdminMemberDetailQueryResult,
        AdminMemberDetailQueryVariables
    >(ADMIN_MEMBER_DETAIL_QUERY, {
        variables: { memberId },
    });

    const { data: historyData } = useQuery<
        AdminLoginHistoryQueryResult,
        AdminLoginHistoryQueryVariables
    >(ADMIN_LOGIN_HISTORY_QUERY, {
        variables: {
            memberId,
            page: { page: historyPage, size: 10 },
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

    if (!data) {
        return (
            <Card className="p-8">
                <div className="text-center">
                    <p className="text-text-muted-light">멤버 정보를 찾을 수 없습니다.</p>
                </div>
            </Card>
        );
    }

    const member = data.adminMember;
    const historyPageData = historyData?.adminLoginHistories;
    const histories = historyPageData?.content ?? [];

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

        setConfirmOpen(false);
        setConfirmType(null);
        setPendingStatus(null);
        setPendingRole(null);
        refetch();
    }

    return (
        <>
            <div className="space-y-6">
                {/* 상단 네비게이션 */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        목록으로
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 좌측: 프로필 카드 */}
                    <div className="lg:col-span-1">
                        <Card className="p-6 space-y-6">
                            {/* 프로필 헤더 */}
                            <div className="text-center">
                                <div className="w-24 h-24 mx-auto rounded-full bg-accent-soft flex items-center justify-center text-accent text-3xl font-bold mb-4">
                                    {member.name.charAt(0).toUpperCase()}
                                </div>
                                <h2 className="text-xl font-bold mb-1">{member.name}</h2>
                                <div className="flex items-center justify-center gap-1 text-sm text-text-muted-light mb-4">
                                    <Mail className="w-4 h-4" />
                                    {member.email}
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <StatusBadge status={member.status} />
                                    <RoleBadge role={member.role} />
                                </div>
                            </div>

                            <Divider />

                            {/* 기본 정보 */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-8 h-8 rounded-lg bg-surface-light dark:bg-surface-dark flex items-center justify-center">
                                        <Shield className="w-4 h-4 text-text-muted-light" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-text-muted-light">회원 ID</p>
                                        <p className="font-medium">#{member.memberId}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-8 h-8 rounded-lg bg-surface-light dark:bg-surface-dark flex items-center justify-center">
                                        <Calendar className="w-4 h-4 text-text-muted-light" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-text-muted-light">가입일</p>
                                        <p className="font-medium">
                                            {new Date(member.regdate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Divider />

                            {/* 액션 버튼 */}
                            <div className="space-y-2">
                                <Button variant="secondary" size="sm" className="w-full gap-2">
                                    <Edit className="w-4 h-4" />
                                    프로필 수정
                                </Button>
                                <Button variant="danger" size="sm" className="w-full gap-2">
                                    <Trash2 className="w-4 h-4" />
                                    회원 삭제
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* 우측: 상세 정보 */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* 상태 관리 */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">상태 관리</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* 회원 상태 변경 */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Activity className="w-4 h-4" />
                                        회원 상태
                                    </label>
                                    <select
                                        value={member.status}
                                        onChange={(e) => {
                                            setPendingStatus(e.target.value as MemberStatus);
                                            setConfirmType("STATUS");
                                            setConfirmOpen(true);
                                        }}
                                        className="w-full h-10 px-3 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-sm"
                                    >
                                        <option value="READY">READY - 준비</option>
                                        <option value="ACTIVE">ACTIVE - 활성</option>
                                        <option value="DISABLED">DISABLED - 비활성</option>
                                        <option value="DELETED">DELETED - 삭제됨</option>
                                    </select>
                                </div>

                                {/* 회원 권한 변경 */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Shield className="w-4 h-4" />
                                        회원 권한
                                    </label>
                                    <select
                                        value={member.role}
                                        onChange={(e) => {
                                            setPendingRole(e.target.value as UserRole);
                                            setConfirmType("ROLE");
                                            setConfirmOpen(true);
                                        }}
                                        className="w-full h-10 px-3 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-sm"
                                    >
                                        <option value="USER">USER - 일반 사용자</option>
                                        <option value="ADMIN">ADMIN - 관리자</option>
                                    </select>
                                </div>
                            </div>

                            {/* 빠른 액션 */}
                            <div className="mt-6 pt-6 border-t border-border-light dark:border-border-dark">
                                <p className="text-sm font-medium mb-3">빠른 액션</p>
                                <div className="flex flex-wrap gap-2">
                                    <Button variant="secondary" size="xs" className="gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        활성화
                                    </Button>
                                    <Button variant="secondary" size="xs" className="gap-1">
                                        <Ban className="w-3 h-3" />
                                        비활성화
                                    </Button>
                                    <Button variant="secondary" size="xs" className="gap-1">
                                        <Shield className="w-3 h-3" />
                                        관리자 권한 부여
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        {/* 로그인 이력 */}
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    로그인 이력
                                </h3>
                                <span className="text-xs text-text-muted-light">
                                    최근 {histories.length}개
                                </span>
                            </div>

                            {histories.length === 0 ? (
                                <div className="py-12 text-center">
                                    <Activity className="w-12 h-12 mx-auto mb-3 text-text-muted-light opacity-50" />
                                    <p className="text-sm text-text-muted-light">
                                        로그인 이력이 없습니다
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-3">
                                        {histories.map((h, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-start gap-3 p-3 rounded-lg bg-surface-light dark:bg-surface-dark"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-accent-soft flex items-center justify-center shrink-0">
                                                    <Globe className="w-5 h-5 text-accent" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="text-sm font-medium">
                                                            {h.device || "알 수 없는 기기"}
                                                        </p>
                                                        <span className="text-xs px-2 py-0.5 rounded bg-accent-soft text-accent">
                                                            {idx === 0 ? "최근" : ""}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-text-muted-light">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(h.loginAt).toLocaleString()}
                                                        </span>
                                                        {h.ip && (
                                                            <span className="flex items-center gap-1">
                                                                <MapPin className="w-3 h-3" />
                                                                {h.ip}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {historyPageData && (
                                        <div className="mt-6">
                                            <Pagination
                                                pageNumber={historyPageData.pageNumber}
                                                totalPages={historyPageData.totalPages}
                                                hasNext={historyPageData.hasNext}
                                                hasPrevious={historyPageData.hasPrevious}
                                                isFirst={historyPageData.isFirst}
                                                isLast={historyPageData.isLast}
                                                onChange={setHistoryPage}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </Card>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={confirmOpen}
                title="변경 확인"
                message="정말 변경하시겠습니까? 이 작업은 즉시 적용됩니다."
                confirmText="변경"
                cancelText="취소"
                onConfirm={handleConfirm}
                onClose={() => {
                    setConfirmOpen(false);
                    setConfirmType(null);
                    setPendingStatus(null);
                    setPendingRole(null);
                }}
            />
        </>
    );
}