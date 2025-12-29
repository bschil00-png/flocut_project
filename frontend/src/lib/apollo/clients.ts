// src/lib/apollo/clients.ts

import {
    ApolloClient,
    InMemoryCache,
    HttpLink,
    ApolloLink,
    Observable,
    FetchResult,
} from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";

// refresh 중복 방지 플래그
let isRefreshing = false;

// refresh 완료 후 재시도할 요청 큐
let pendingRequests: Array<() => void> = [];

// GraphQL 인증 에러 처리용 ErrorLink
const errorLink = new ErrorLink((error) => {
    const { graphQLErrors, operation, forward } = error as any;

    if (!graphQLErrors) return;

    for (const err of graphQLErrors) {
        const isUnauthenticated =
            err.extensions?.code === "UNAUTHENTICATED" ||
            err.message === "UNAUTHENTICATED";

        if (!isUnauthenticated) continue;

        // refresh 중이 아니면 시작
        if (!isRefreshing) {
            isRefreshing = true;

            return new Observable<FetchResult>((observer) => {
                fetch("/api/proxy/auth/refresh", {
                    method: "POST",
                    credentials: "include",
                })
                    .then((res) => {
                        if (!res.ok) {
                            throw new Error("refresh failed");
                        }

                        isRefreshing = false;

                        // 대기 중인 요청 재시도
                        pendingRequests.forEach((cb) => cb());
                        pendingRequests = [];

                        // 현재 요청 재실행
                        forward(operation).subscribe({
                            next: observer.next.bind(observer),
                            error: observer.error.bind(observer),
                            complete: observer.complete.bind(observer),
                        });
                    })
                    .catch((err) => {
                        isRefreshing = false;
                        pendingRequests = [];

                        // refresh도 실패 → 강제 로그아웃
                        window.dispatchEvent(new Event("auth:logout"));
                        observer.error(err);
                    });
            });
        }

        // 이미 refresh 중이면 큐에 쌓기
        return new Observable<FetchResult>((observer) => {
            pendingRequests.push(() => {
                forward(operation).subscribe({
                    next: observer.next.bind(observer),
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer),
                });
            });
        });
    }
});


// HTTP Link
const httpLink = new HttpLink({
    uri: "/api/proxy/graphql",
    credentials: "include",
});

// Apollo Client 생성
export const apolloClient = new ApolloClient({
    link: ApolloLink.from([errorLink, httpLink]),
    cache: new InMemoryCache(),
});
