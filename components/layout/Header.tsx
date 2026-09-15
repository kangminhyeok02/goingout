import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">🌱</span>
          <span className="text-lg font-bold text-zinc-900">슬기로운 퇴사생활</span>
        </Link>
        <span className="hidden text-sm text-zinc-500 sm:block">
          결정부터 이후의 삶까지, 퇴사 준비 도구 모음
        </span>
      </div>
    </header>
  );
}
