"use client";

import Link from "next/link";
import { useSidebar } from "@/components/layout/SidebarContext";

export function Header() {
  const { toggle } = useSidebar();

  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            aria-label="전체 서비스 메뉴 열기"
            className="flex h-9 w-9 flex-col items-center justify-center gap-1 rounded-lg hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
          >
            <span className="block h-0.5 w-5 rounded-full bg-zinc-700" />
            <span className="block h-0.5 w-5 rounded-full bg-zinc-700" />
            <span className="block h-0.5 w-5 rounded-full bg-zinc-700" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🌱</span>
            <span className="text-lg font-bold text-zinc-900">슬기로운 퇴사생활</span>
          </Link>
        </div>
        <span className="hidden text-sm text-zinc-500 sm:block">
          결정부터 이후의 삶까지, 퇴사 준비 도구 모음
        </span>
      </div>
    </header>
  );
}
