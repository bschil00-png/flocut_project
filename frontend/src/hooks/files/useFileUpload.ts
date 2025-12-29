import { useState } from "react";
import { uploadFile } from "@/lib/rest/file/file.rest";

export function useFileUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const upload = async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      return await uploadFile(file);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    upload,
    loading,
    error,
  };
}