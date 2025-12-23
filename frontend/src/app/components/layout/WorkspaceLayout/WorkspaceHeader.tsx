"use client";

import { useState } from "react";
import { Settings } from "lucide-react";

import IconButton from "@/app/components/ui/icon-button/IconButton";
import ProfileSettingsModal from "@/app/components/layout/WorkspaceLayout/ProfileSettingsModal";

export default function WorkspaceHeader() {

    const [openProfile, setOpenProfile] = useState(false);

    return (
        <>
            {/*  Workspace Header*/}
            <header
                className="
          h-14
          flex items-center justify-between
          px-4 md:px-6

          border-b
          border-border-light
          dark:border-border-dark

          bg-background-light
          dark:bg-background-dark
        "
            >
                {/* Left Area - Workspace Title*/}
                <div className="flex items-center gap-3 min-w-0">
                    <h1
                        className="
              text-base
              font-semibold
              truncate
              text-text-primary-light
              dark:text-text-primary-dark
            "
                    >
                        FLOCUT WORKSPACE
                    </h1>

                    {/* 상태 텍스트 (임시) */}
                    <span
                        className="
              text-xs
              text-text-muted-light
              dark:text-text-muted-dark
              hidden sm:inline
            "
                    >
            저장됨
          </span>
                </div>

                {/*Right Area - Profile / Settings*/}
                <div className="flex items-center gap-2">
                    {/* 프로필 버튼 모달 오픈  */}
                    <button
                        type="button"
                        onClick={() => setOpenProfile(true)}
                        aria-label="Open profile settings"
                        className="
              w-8 h-8
              rounded-full

              bg-accent
              text-white

              flex items-center justify-center
              text-sm font-semibold

              hover:opacity-90
              transition
            "
                    >
                        F
                    </button>
                </div>
            </header>

            {/* Profile / Settings Modal */}
            <ProfileSettingsModal
                open={openProfile}
                onCloseAction={() => setOpenProfile(false)}
            />
        </>
    );
}
