
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const apolloClient = new ApolloClient({
    link: new HttpLink({
        uri: "/graphql", // 프록시 경우(이후에 수정예정)
        credentials: "include",
    }),
    cache: new InMemoryCache(),
});
