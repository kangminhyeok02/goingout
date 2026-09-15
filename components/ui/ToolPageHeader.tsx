import Link from "next/link";
import type { ToolMeta } from "@/data/tools";

export function ToolPageHeader({ tool }: { tool: ToolMeta }) {
  return (
    <div className="flex flex-col gap-3">
      <Link
        href="/"
        className="w-fit rounded text-sm text-zinc-500 hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
      >
        ← 허브로 돌아가기
      </Link>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{tool.emoji}</span>
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
          {tool.title}
        </h1>
      </div>
      <p className="max-w-2xl text-sm text-zinc-600 sm:text-base">
        {tool.pageDescription}
      </p>
    </div>
  );
}
