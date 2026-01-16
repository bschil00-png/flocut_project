import { useState, useEffect } from "react";
import { api } from "@/lib/axios";

export function useFileText(fileId: number | null) {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!fileId) return;

        let cancelled = false;
        setLoading(true);
        setError(null);

        api
            .get<string>(`/api/files/${fileId}/preview/text`)
            .then((data) => {
                if (!cancelled) {
                    setText(data); // interceptor 때문에 data 자체가 string
                }
            })
            .catch((err) => {
                if (!cancelled) setError(err);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [fileId]);

    return { text, loading, error };
}
