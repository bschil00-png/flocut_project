"use client";

import { motion } from "framer-motion";

type SpinnerSize = "sm" | "md" | "lg";

interface LoadingSpinnerProps {
    size?: SpinnerSize;
    fullscreen?: boolean;
    blockUI?: boolean;
    color?: string;
}

export default function LoadingSpinner({
                                           size = "md",
                                           fullscreen = false,
                                           blockUI = true,
                                           color = "gray-900",
                                       }: LoadingSpinnerProps): JSX.Element {
    const sizeMap: Record<SpinnerSize, string> = {
        sm: "w-4 h-4 border-2",
        md: "w-8 h-8 border-[3px]",
        lg: "w-12 h-12 border-4",
    };

    const spinner = (
        <motion.div
            role="status"
            aria-label="Loading..."
            className={`rounded-full border-t-transparent border-${color} ${sizeMap[size]}`}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
    );

    if (fullscreen) {
        return (
            <div
                className={`fixed inset-0 flex items-center justify-center z-50 ${
                    blockUI ? "" : "pointer-events-none"
                }`}
            >
                {spinner}
            </div>
        );
    }

    return spinner;
}
