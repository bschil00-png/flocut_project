import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  Observable,
  FetchResult,
} from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";

let isRefreshing = false;
let pendingRequests: Array<() => void> = [];

const errorLink = new ErrorLink((error) => {
  const { graphQLErrors, operation, forward } = error as any;
  if (!graphQLErrors) return;

  for (const err of graphQLErrors) {
    const isUnauthenticated =
      err.extensions?.code === "UNAUTHENTICATED" ||
      err.message === "UNAUTHENTICATED";

    if (!isUnauthenticated) continue;

    if (!isRefreshing) {
      isRefreshing = true;

      return new Observable<FetchResult>((observer) => {
        fetch("/api/proxy/auth/refresh", {
          method: "POST",
          credentials: "include",
        })
          .then((res) => {
            if (!res.ok) throw new Error("refresh failed");

            isRefreshing = false;
            pendingRequests.forEach((cb) => cb());
            pendingRequests = [];

            forward(operation).subscribe(observer);
          })
          .catch((err) => {
            isRefreshing = false;
            pendingRequests = [];
            window.dispatchEvent(new Event("member:logout"));
            observer.error(err);
          });
      });
    }

    return new Observable<FetchResult>((observer) => {
      pendingRequests.push(() => {
        forward(operation).subscribe(observer);
      });
    });
  }
});

const httpLink = new HttpLink({
  uri: "/api/proxy/graphql",
  credentials: "include",
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, httpLink]),
  cache: new InMemoryCache(),
});
