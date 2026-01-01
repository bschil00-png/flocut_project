"use client"

import Card from "@/app/components/ui/card/Card";

type StatCardProps = {
    label: string;
    value: number;
};

// 통계 카드
export default function StatCard({label, value}: StatCardProps) {
    return (
        <Card padding="md" >
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                {label}
            </p>
            <p className="mt-2 text-2xl font-semibold">
                {value.toLocaleString()}
            </p>
        </Card>
    )
}
