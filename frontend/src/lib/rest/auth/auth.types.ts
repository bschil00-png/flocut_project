export interface MeResponse {
    memberId: number;
    email: string;
    name: string;
    tel: string;
    role: "USER" | "ADMIN";
}
