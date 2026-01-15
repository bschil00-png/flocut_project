"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  updateMyProfile,
  deleteMyAccount,
} from "@/lib/rest/member/member.rest";
import { updateAuthUser } from "@/store/slice/authSlice";
import { setAvatarId } from "@/store/slice/uislice";
import { useAuthActions } from "@/hooks/useAuthActions";

export function useProfileActions() {
  const dispatch = useDispatch();
  const { logout } = useAuthActions();
  const user = useSelector((state: RootState) => state.auth.user);

  async function updateProfile(payload: {
    name: string;
    tel: string;
    profileImage?: string;
  }) {
    if (!user) return;

    //  서버 업데이트
    await updateMyProfile(payload);

    // Redux 즉시 반영
    dispatch(
      updateAuthUser({
        name: payload.name,
        tel: payload.tel,
        profileImage: payload.profileImage,
      })
    );

    //  UI slice 동기화
    if (payload.profileImage) {
      dispatch(setAvatarId(payload.profileImage));
    }
  }

  async function deleteAccount() {
    await deleteMyAccount();
    await logout();
  }

  return {
    updateProfile,
    deleteAccount,
  };
}
