import { apolloClient } from "@/lib/apollo/clients";
import {MyProfile} from "@/lib/graphql/auth/auth.type";
import {ME_QUERY} from "@/lib/graphql/auth/ auth.query";

interface MeQueryResult {
    me: MyProfile;
}


// 그래프큐엘 기준 me 조회
export async function getMeByGraphQL(): Promise<MyProfile> {
    const { data } = await apolloClient.query<MeQueryResult>({
        query: ME_QUERY,
        fetchPolicy: "network-only",
    });

    // data가 undefined일 수 있으므로 체크
    if (!data) {
        throw new Error("사용자 데이터 찾기에 실패했습니다.");
    }

    return data.me;
}