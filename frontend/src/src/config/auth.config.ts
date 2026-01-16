// 보호된 경로

export const PROTECTED_PATHS = [
  "/notes",
  "/documents",
  "/workspace",
  "/mypage",
] as const;


  // 주어진 pathname이 보호 경로인지 판단
export function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some(path =>
    pathname.startsWith(path)
  );
}