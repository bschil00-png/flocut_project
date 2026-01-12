import AdminMemberDetail from "@/app/components/admin/members/AdminMemberDetail";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
    const { id } = await params;
    const memberId = Number(id);

    if (Number.isNaN(memberId)) {
        return <div>잘못된 접근입니다.</div>;
    }

    return <AdminMemberDetail memberId={memberId} />;
}
