import {useRef, useState} from "react";


// 회원 탈퇴 , 로그아웃 전용 훅

export function useConfirm() {
    const [open, setOpen] = useState(false);
    const resolver = useRef<(v: boolean) => void>();

    function confirm() {
        setOpen(true);
        return new Promise<boolean>((resolve) => {
            resolver.current = resolve;
        });
    }

    function handleClose(result: boolean) {
        setOpen(false);
        resolver.current?.(result);
    }

    return { confirm, open, handleClose };
}
