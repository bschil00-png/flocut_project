import { useEffect, useRef } from "react";

interface AutoSaveData {
  title?: string;
  content?: string;
}

export function useAutoSave(
  onSave: (data: AutoSaveData) => Promise<void>,
  data: AutoSaveData,
  delay = 2000
) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const previousDataRef = useRef<AutoSaveData>(data);
  const isSavingRef = useRef(false);

  useEffect(() => {
    // 데이터 변경 없으면 스킵
    if (
      previousDataRef.current.title === data.title &&
      previousDataRef.current.content === data.content
    ) {
      return;
    }

    // 빈 값이면 저장 안 함
    if (!data.title?.trim() && !data.content?.trim()) {
      return;
    }

    previousDataRef.current = data;

    // 기존 타이머 클리어
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 디바운스 자동저장
    timeoutRef.current = setTimeout(() => {
      if (isSavingRef.current) return;

      isSavingRef.current = true;

      onSave(data)
        .then(() => {
          console.log("자동 저장 완료");
        })
        .catch((err) => {
          console.error("자동 저장 실패", err);
        })
        .finally(() => {
          isSavingRef.current = false;
        });
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data.title, data.content, delay, onSave]);
}