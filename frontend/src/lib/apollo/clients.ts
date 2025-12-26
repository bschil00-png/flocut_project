// src/lib/apollo/clients.ts

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    // REST와 동일하게 proxy 경로를 타도록 설정
    uri: "/api/proxy/graphql",
    credentials: "include",
  }),
  cache: new InMemoryCache(),
});
