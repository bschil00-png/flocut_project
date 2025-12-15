import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

/**
 * Apollo Client 인스턴스
 * - GraphQL 통신 전용
 * - credentials: include → 쿠키 기반 인증 대비
 */
export const apolloClient = new ApolloClient({
    link: new HttpLink({
        uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
        credentials: "include",
    }),
    cache: new InMemoryCache(),
});
