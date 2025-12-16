import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const link = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
    credentials: "include",
});

export const apolloClient = new ApolloClient({
    link,
    cache: new InMemoryCache(),
});
