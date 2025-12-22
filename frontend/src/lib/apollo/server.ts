
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// 클라이언트 전용
// RSC/ SSR 대비 구조
//  쿠키 직접 주입 방식으로 서버에서 인증 유지 가능하게
//  이후에 사용 예정
export function createServerApolloClient(cookie?: string) {
    return new ApolloClient({
        link: new HttpLink({
            uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
            headers: cookie ? { cookie } : {},
        }),
        cache: new InMemoryCache(),
    });
}
