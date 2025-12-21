import { useSelector } from "react-redux";
import { RootState } from "@/store";

export function useAuthState() {
  return useSelector((state: RootState) => state.auth);
}