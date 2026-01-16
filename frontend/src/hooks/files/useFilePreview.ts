import { useState, useEffect } from "react";
import { api } from "@/lib/axios";

export function useFilePreview(fileId: number | null) {
    const [url, setUrl] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!fileId) return;

        setLoading(true);
        setError(null);

        api
            .get<string>(`/api/files/${fileId}/preview`)
            .then(setUrl)
            .catch(setError)
            .finally(() => setLoading(false));
    }, [fileId]);

    return { url, loading, error };
}