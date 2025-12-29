"use client";

// Admin 멤버 조회 페이지

import AdminMemberTable from "@/app/components/admin/members/AdminMemberTable";

export default function AdminMembersPage() {
  return (
    <div className="space-y-6">

      <h1 className="text-xl font-semibold text-gray-900">
        Members
      </h1>

      {/* 테이블 */}
      <div className="bg-white border rounded-xl p-6">
       <AdminMemberTable />
      </div>
    </div>
  );
}
