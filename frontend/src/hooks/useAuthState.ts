import { useSelector } from "react-redux";
import { RootState } from "@/store";

// auth 상태 전용 selector
export function useAuthState() {
  return useSelector((state: RootState) => state.auth);
}
