
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// 클라이언트 전용
export function createServerApolloClient(cookie?: string) {
    return new ApolloClient({
        link: new HttpLink({
            uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
            headers: cookie ? { cookie } : {},
        }),
        cache: new InMemoryCache(),
    });
}
