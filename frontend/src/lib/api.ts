// // src/lib/api.ts
// // 프론트에서 무조건 api/proxy 로 호출
// export const apiFetch = (url: string, options?: RequestInit) => {
//     return fetch(`/api/proxy${url}`, {
//         credentials: "include",
//         ...options,
//     });
// };
// 이제 이걸 axios에서 흡수해서 사용