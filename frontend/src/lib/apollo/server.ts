// src/lib/apollo/server.ts
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export function createServerApolloClient(cookie?: string) {
    return new ApolloClient({
        link: new HttpLink({
            uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
            headers: cookie ? { cookie } : {},
        }),
        cache: new InMemoryCache(),
    });
}
