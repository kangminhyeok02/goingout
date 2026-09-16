"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { drawQuoteCard } from "@/lib/quoteCardImage";
import { saveOrShareCanvas } from "@/lib/canvasImage";
import data from "@/data/templates/resignation-quotes.json";

export default function QuoteSharePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = use(searchParams);
  const quote = typeof params.q === "string" ? params.q.trim() : "";
  const themeKey = typeof params.t === "string" ? params.t : undefined;
  const theme = data.themes.find((t) => t.key === themeKey) ?? data.themes[0];

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"idle" | "saved">("idle");
  const valid = quote.length > 0;

  useEffect(() => {
    if (!valid || !canvasRef.current) return;
    drawQuoteCard(canvasRef.current, quote, theme);
  }, [valid, quote, theme]);

  async function handleSave() {
    if (!canvasRef.current) return;
    const result = await saveOrShareCanvas(
      canvasRef.current,
      "퇴사-명언-카드.png",
      "퇴사 명언 카드"
    );
    if (result === "cancelled") return;
    setStatus("saved");
  }

  if (!valid) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-16 text-center">
        <p className="text-zinc-600">링크가 올바르지 않아요.</p>
        <Link href="/tools/resignation-quotes" className="text-sm text-teal-700 underline">
          명언 카드 만들러 가기
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-10 sm:px-6">
      <div className="text-center">
        <p className="text-2xl">🎴</p>
        <h1 className="mt-2 text-xl font-bold text-zinc-900">
          퇴사 명언 카드가 도착했어요
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          아래 버튼을 누르면 이 카드가 내 폰 사진첩에 저장돼요
        </p>
      </div>

      <Card className="flex justify-center overflow-hidden p-0">
        <canvas ref={canvasRef} className="w-full" />
      </Card>

      <Button onClick={handleSave} className="w-full">
        {status === "saved" ? "저장됐어요 ✓" : "📲 내 폰에 저장하기"}
      </Button>

      <Link
        href="/tools/resignation-quotes"
        className="text-center text-sm text-zinc-500 hover:text-teal-700"
      >
        나도 카드 만들어보기 →
      </Link>
    </div>
  );
}
