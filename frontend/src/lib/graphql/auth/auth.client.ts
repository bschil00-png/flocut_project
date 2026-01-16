import { apolloClient } from "@/lib/apollo/clients";
import {MyProfile} from "@/lib/graphql/auth/auth.type";
import {ME_QUERY} from "@/lib/graphql/auth/ auth.query";


interface MeQueryResult {
  me: MyProfile;
}


// GraphQL 기준 me 조회
// refresh 중에도 기존 캐시를 우선 사용해 UI 안정성 확보
export async function getMeByGraphQL(): Promise<MyProfile> {
  const { data } = await apolloClient.query<MeQueryResult>({
    query: ME_QUERY,
    fetchPolicy: "cache-first",
  });

  if (!data || !data.me) {
    throw new Error("사용자 데이터 조회 실패");
  }

  return data.me;
}
