import Link from "next/link";
import type { ToolMeta } from "@/data/tools";

export function ToolCard({ tool }: { tool: ToolMeta }) {
  if (tool.comingSoon) {
    return (
      <div className="flex h-full flex-col gap-2 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-5 opacity-70">
        <div className="text-2xl">{tool.emoji}</div>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-zinc-700">{tool.title}</h3>
          <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs text-zinc-600">
            준비 중
          </span>
        </div>
        <p className="text-sm text-zinc-500">{tool.shortDescription}</p>
      </div>
    );
  }

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="flex h-full flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
    >
      <div className="text-2xl">{tool.emoji}</div>
      <h3 className="font-semibold text-zinc-900">{tool.title}</h3>
      <p className="text-sm text-zinc-600">{tool.shortDescription}</p>
    </Link>
  );
}
