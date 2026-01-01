"use client";

import Card from "@/app/components/ui/card/Card";
import ColorModeToggle from "@/app/components/layout/ColorModeToggle";

export default function AppearancePanel() {
    return (
        <div className="space-y-6 max-w-xl">
            <Card>
                <h3 className="text-sm font-semibold mb-4">
                    테마 설정
                </h3>
                <ColorModeToggle />
            </Card>
        </div>
    );
}
