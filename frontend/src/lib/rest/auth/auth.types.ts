export interface MeResponse {
    memberId: number;
    email: string;
    name: string;
    role: "USER" | "ADMIN";
}
