"use client";

import { useState } from "react";
import SettingsSidebar from "./SettingsSidebar";
import ProfilePanel from "./panels/ProfilePanel";
import AppearancePanel from "./panels/AppearancePanel";
import AccountPanel from "./panels/AccountPanel";

type SettingsContainerProps = {
    onClose: () => void;
};

export default function SettingsContainer({
                                              onClose,
                                          }: SettingsContainerProps) {
    const [active, setActive] = useState<
        "profile" | "appearance" | "account"
    >("profile");

    return (
        <div
            className="
        w-full h-full
        flex
      "
        >
            {/* 왼쪽 설정 메뉴 */}
            {/*<SettingsSidebar*/}
            {/*    active={active}*/}
            {/*    onChange={setActive}*/}
            {/*/>*/}

            {/* 오른쪽 설정 내용 */}
            <div className="flex-1 p-8 overflow-y-auto">
                {active === "profile" && <ProfilePanel />}
                {active === "appearance" && <AppearancePanel />}
                {active === "account" && <AccountPanel />}
            </div>
        </div>
    );
}
