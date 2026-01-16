"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import {
  ArrowLeft, Mail, Calendar, Shield, Activity, MapPin, Globe, Clock, Ban, CheckCircle
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

import { updateMemberStatus, updateMemberRole } from "@/lib/rest/member/member.rest";
import { MemberStatus, UserRole } from "@/lib/graphql/auth/auth.type";

type Props = { memberId: number; };

export default function AdminMemberDetail({ memberId }: Props) {
  const router = useRouter();
  const [pendingStatus, setPendingStatus] = useState<MemberStatus | null>(null);
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);
  const [historyPage, setHistoryPage] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState<"STATUS" | "ROLE" | null>(null);

  const { data, loading, refetch } = useQuery<AdminMemberDetailQueryResult, AdminMemberDetailQueryVariables>(
    ADMIN_MEMBER_DETAIL_QUERY, { variables: { memberId } }
  );

  const { data: historyData } = useQuery<AdminLoginHistoryQueryResult, AdminLoginHistoryQueryVariables>(
    ADMIN_LOGIN_HISTORY_QUERY, { variables: { memberId, page: { page: historyPage, size: 10 } } }
  );

  if (loading) return <div className="py-20 flex justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div>;
  if (!data) return <Card className="p-8 text-center">정보를 찾을 수 없습니다.</Card>;

  const member = data.adminMember;
  const historyPageData = historyData?.adminLoginHistories;
  const histories = historyPageData?.content ?? [];

  async function handleConfirm() {
    if (confirmType === "STATUS" && pendingStatus) await updateMemberStatus(memberId, { status: pendingStatus, reason: "관리자 변경" });
    if (confirmType === "ROLE" && pendingRole) await updateMemberRole(memberId, { role: pendingRole, reason: "관리자 변경" });
    setConfirmOpen(false); setConfirmType(null); refetch();
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
        <ArrowLeft size={16} /> 목록으로
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 좌측 프로필 */}
        <Card className="p-8 dark:bg-surface-dark border-none shadow-sm text-center h-fit">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-accent text-white flex items-center justify-center text-3xl font-bold shadow-xl shadow-accent/20 mb-6">
            {member.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold">{member.name}</h2>
          <p className="text-sm text-text-muted-light mb-6">{member.email}</p>
          <div className="flex justify-center gap-2 mb-8">
            <StatusBadge status={member.status} />
            <RoleBadge role={member.role} />
          </div>
          <Divider />
          <div className="mt-8 space-y-4 text-left">
            <div className="flex justify-between items-center text-sm"><span className="text-text-muted-light">Member ID</span><span className="font-bold">#{member.memberId}</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-text-muted-light">가입일자</span><span className="font-bold">{new Date(member.regdate).toLocaleDateString()}</span></div>
          </div>
        </Card>

        {/* 우측 관리 설정 */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 dark:bg-surface-dark border-none shadow-sm">
            <h3 className="text-lg font-bold mb-6">권한 및 상태 제어</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted-light uppercase">멤버 상태 변경</label>
                <select value={member.status} onChange={(e) => { setPendingStatus(e.target.value as MemberStatus); setConfirmType("STATUS"); setConfirmOpen(true); }}
                        className="w-full h-12 px-4 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark font-medium">
                  <option value="ACTIVE">ACTIVE - 활성</option>
                  <option value="DISABLED">DISABLED - 비활성</option>
                  <option value="DELETED">DELETED - 삭제</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted-light uppercase">멤버 역할 변경</label>
                <select value={member.role} onChange={(e) => { setPendingRole(e.target.value as UserRole); setConfirmType("ROLE"); setConfirmOpen(true); }}
                        className="w-full h-12 px-4 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark font-medium">
                  <option value="USER">USER - 일반</option>
                  <option value="ADMIN">ADMIN - 관리자</option>
                </select>
              </div>
            </div>
          </Card>

          <Card className="p-6 dark:bg-surface-dark border-none shadow-sm">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Clock size={20} className="text-accent" /> 로그인 이력</h3>
            <div className="space-y-3">
              {histories.length === 0 ? <p className="text-center py-10 text-text-muted-light">로그인 기록이 없습니다.</p> : histories.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-surface-light dark:bg-surface-hover/30">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white dark:bg-surface-dark rounded-lg shadow-sm"><Globe size={18} className="text-accent" /></div>
                    <div><p className="text-sm font-bold">{h.device || "Unknown Device"}</p><p className="text-[10px] text-text-muted-light">{h.ip}</p></div>
                  </div>
                  <p className="text-[11px] font-medium">{new Date(h.loginAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
            {historyPageData && (
              <div className="mt-8 flex justify-center">
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
          </Card>
        </div>
      </div>

      <ConfirmDialog open={confirmOpen} title="변경 요청 확인" message="해당 멤버의 상태/권한을 변경하시겠습니까?" confirmText="확인" cancelText="취소" onConfirm={handleConfirm} onClose={() => setConfirmOpen(false)} />
    </div>
  );
}