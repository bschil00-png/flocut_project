"use client";

import Link from "next/link";
import Card from "@/app/components/ui/card/Card";
import Button from "@/app/components/ui/button/Button";
import Divider from "@/app/components/ui/divider/Divider";

export default function ForbiddenPage() {
    return (
        <div className="
      min-h-screen
      flex items-center justify-center
      bg-background-light dark:bg-background-dark
      px-4
    ">
            <Card className="w-full max-w-md text-center" padding="lg">
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                    ACCESS DENIED
                </p>

                <h1 className="mt-2 text-2xl font-semibold">
                    접근 권한이 없습니다
                </h1>

                <p className="mt-3 text-sm text-text-muted-light dark:text-text-muted-dark">
                    이 페이지는 관리자 전용 영역입니다.<br />
                    권한이 있는 계정으로 로그인했는지 확인해 주세요.
                </p>

                <Divider className="my-6" />

                <div className="flex justify-center gap-3">
                    <Link href="/">
                        <Button variant="secondary">
                            홈으로 이동
                        </Button>
                    </Link>

                    <Button
                        variant="ghost"
                        onClick={() => history.back()}
                    >
                        이전 페이지
                    </Button>
                </div>
            </Card>
        </div>
    );
}
