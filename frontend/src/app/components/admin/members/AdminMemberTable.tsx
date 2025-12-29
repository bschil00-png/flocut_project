"use client";

import { useQuery } from "@apollo/client/react";
import { ADMIN_MEMBERS_QUERY } from "@/lib/graphql/admin/member.admin.query";
import {
  updateMemberStatus,
  updateMemberRole,
} from "@/lib/rest/member/member.rest";

export default function AdminMemberTable() {
  const { data, loading, error, refetch } = useQuery(
    ADMIN_MEMBERS_QUERY,
    {
      variables: { page: 0, size: 20 },
    }
  );

  if (loading) return <div>불러오는 중...</div>;
  if (error) return <div>데이터 로딩 실패</div>;

  const members = data.adminMembers.content;

  // 상태 변경 핸들러
  async function handleStatusChange(memberId: number, status: string) {
    await updateMemberStatus(memberId, {
      status: status as any,
      reason: "관리자 변경",
    });

    refetch();
  }

  // 권한 변경 핸들러
  async function handleRoleChange(memberId: number, role: string) {
    await updateMemberRole(memberId, {
      role: role as any,
      reason: "관리자 변경",
    });

    refetch();
  }

  return (
    <table className="w-full">
      <tbody>
      {members.map((m) => (
        <tr key={m.memberId}>
          <td>{m.email}</td>
          <td>{m.name}</td>

          <td>
            <select
              value={m.role}
              onChange={(e) =>
                handleRoleChange(m.memberId, e.target.value)
              }
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </td>

          <td>
            <select
              value={m.status}
              onChange={(e) =>
                handleStatusChange(m.memberId, e.target.value)
              }
            >
              <option value="READY">READY</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="DISABLED">DISABLED</option>
              <option value="DELETED">DELETED</option>
            </select>
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  );
}
