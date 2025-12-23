"use client";


import PanelModal from "@/app/components/ui/modal/PanelModal";
import SettingsLayout from "@/app/components/settings/SettingsLayout";

export default function Layout({
                                   children,
                               }: {
    children: React.ReactNode;
}) {
    return (
        <PanelModal>
            <SettingsLayout>{children}</SettingsLayout>
        </PanelModal>
    );
}
