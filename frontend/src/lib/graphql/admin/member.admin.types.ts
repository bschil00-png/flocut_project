// 관리자 멤버 한 명
export interface AdminMember {
  memberId: number;
  email: string;
  name: string;
  status: "READY" | "ACTIVE" | "DISABLED" | "DELETED";
  role: "USER" | "ADMIN";
  regdate: string;
}

// PageResponseDTO와 1:1 매칭
export interface AdminMemberPage {
  content: AdminMember[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  hasNext: boolean;
}

// GraphQL query 전체 응답 타입
export interface AdminMembersQueryResult {
  adminMembers: AdminMemberPage;
}

// GraphQL 변수 타입
export interface AdminMembersQueryVariables {
  page: number;
  size: number;
}
