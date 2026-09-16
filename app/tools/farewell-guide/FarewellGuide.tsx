"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { buildSearchUrl } from "@/lib/companySearchLinks";
import data from "@/data/templates/farewell-guide.json";

export function FarewellGuide() {
  const [activeKey, setActiveKey] = useState(data.timings[0].key);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const activeTiming = data.timings.find((t) => t.key === activeKey) ?? data.timings[0];
  const videoSearchUrl = buildSearchUrl("youtube", "퇴사 인사말 마지막 인사 멘트");

  async function handleCopy(message: string, index: number) {
    try {
      await navigator.clipboard.writeText(message);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex((cur) => (cur === index ? null : cur)), 2000);
    } catch {
      setCopiedIndex(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {data.timings.map((timing) => (
          <button
            key={timing.key}
            type="button"
            onClick={() => setActiveKey(timing.key)}
            aria-pressed={activeKey === timing.key}
            className={`rounded-full px-4 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
              activeKey === timing.key
                ? "bg-teal-600 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {timing.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-zinc-500">{activeTiming.description}</p>

      <div className="flex flex-col gap-4">
        {activeTiming.messages.map((m, i) => (
          <Card key={`${activeTiming.key}-${i}`} className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-teal-700">{m.relation}</p>
            <p className="text-sm leading-relaxed text-zinc-700">{m.message}</p>
            <Button
              variant="secondary"
              onClick={() => handleCopy(m.message, i)}
              className="self-start"
            >
              {copiedIndex === i ? "복사됐어요 ✓" : "이 문구 복사하기"}
            </Button>
          </Card>
        ))}
      </div>

      <a
        href={videoSearchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col gap-1 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
      >
        <span className="font-semibold text-zinc-900">📺 퇴사 인사말 참고 영상 찾아보기 ↗</span>
        <span className="text-sm text-zinc-500">
          유튜브에서 실제 퇴사 인사 사례를 검색해서 보여드려요
        </span>
      </a>
    </div>
  );
}
