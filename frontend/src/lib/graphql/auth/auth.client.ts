// src/hooks/useProfileActions.ts (또는 useAuthActions.ts)
import { apolloClient } from "@/lib/apollo/clients";
import {MyProfile} from "@/lib/graphql/auth/auth.type";
import {ME_QUERY} from "@/lib/graphql/auth/ auth.query";

interface MeQueryResult {
    me: MyProfile;
}

export async function getMeByGraphQL(): Promise<MyProfile> {
    const { data } = await apolloClient.query<MeQueryResult>({
        query: ME_QUERY,
        fetchPolicy: "network-only",
    });

    // data가 undefined일 수 있으므로 체크
    if (!data) {
        throw new Error("Failed to fetch user data");
    }

    return data.me;
}