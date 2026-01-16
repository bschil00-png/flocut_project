import {MemberStatus} from "@/lib/graphql/auth/auth.type";


//   멤벋관리용 타입 정리
export interface AdminMember {
    memberId: number;
    email: string;
    name: string;
    status: MemberStatus;
    role: "USER" | "ADMIN";
    regdate: string;
}

export interface AdminMemberPage {
    content: AdminMember[];
    totalElements: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
    hasNext: boolean;
}
