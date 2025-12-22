import Link from "next/link";
import HeaderClient from "./HeaderClient";

interface Props {
  isLoggedInHint: boolean;
}

export default function Header() {
  return (
    <header
      className="
        fixed top-0 z-50 w-full h-16
        border-b
        bg-background-light dark:bg-background-dark
        border-border-light dark:border-border-dark
      "
    >
      <div className="mx-auto max-w-7xl h-full px-6 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="
            font-bold text-lg
            text-text-primary-light
            dark:text-text-primary-dark
          "
        >
          FLOCUT
        </Link>

        {/* Nav */}
        <nav
          className="
            hidden md:flex gap-8 text-sm
            text-text-muted-light
            dark:text-text-muted-dark
          "
        >
          <Link href="/about">회사 소개</Link>
          <Link href="/documents">문서</Link>
          <Link href="/notes">스튜디오</Link>
          <Link href="/calendar">캘린더</Link>
          <Link href="/support">고객지원</Link>
        </nav>

        {/* Client Island */}
        <HeaderClient  />
      </div>
    </header>
  );
}
