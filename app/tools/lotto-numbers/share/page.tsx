"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { drawLottoCard } from "@/lib/lottoImage";
import { saveOrShareCanvas } from "@/lib/canvasImage";

function parseNumbers(raw: string | undefined): number[] | null {
  if (!raw) return null;
  const numbers = raw
    .split(",")
    .map((n) => Number(n))
    .filter((n) => Number.isInteger(n) && n >= 1 && n <= 45);
  return numbers.length === 6 ? numbers : null;
}

export default function LottoSharePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = use(searchParams);
  const numbers = parseNumbers(
    typeof params.n === "string" ? params.n : undefined
  );
  const bonusRaw = typeof params.b === "string" ? Number(params.b) : NaN;
  const bonus = Number.isInteger(bonusRaw) && bonusRaw >= 1 && bonusRaw <= 45 ? bonusRaw : null;
  const message = typeof params.m === "string" ? params.m : "";

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"idle" | "saved">("idle");
  const valid = numbers !== null && bonus !== null;

  useEffect(() => {
    if (!valid || !canvasRef.current) return;
    drawLottoCard(canvasRef.current, numbers!, bonus!, message);
  }, [valid, numbers, bonus, message]);

  async function handleSave() {
    if (!canvasRef.current) return;
    const result = await saveOrShareCanvas(
      canvasRef.current,
      "퇴사-기념-행운번호.png",
      "퇴사 기념 행운번호"
    );
    if (result === "cancelled") return;
    setStatus("saved");
  }

  if (!valid) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-16 text-center">
        <p className="text-zinc-600">링크가 올바르지 않아요.</p>
        <Link href="/tools/lotto-numbers" className="text-sm text-teal-700 underline">
          번호 직접 뽑으러 가기
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-10 sm:px-6">
      <div className="text-center">
        <p className="text-2xl">🍀</p>
        <h1 className="mt-2 text-xl font-bold text-zinc-900">
          퇴사 기념 행운번호가 도착했어요
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          아래 버튼을 누르면 이 카드가 내 폰 사진첩에 저장돼요
        </p>
      </div>

      <Card className="flex justify-center overflow-hidden bg-gradient-to-br from-slate-900 to-teal-900 p-0">
        <canvas ref={canvasRef} className="w-full" />
      </Card>

      <Button onClick={handleSave} className="w-full">
        {status === "saved" ? "저장됐어요 ✓" : "📲 내 폰에 저장하기"}
      </Button>

      <Link
        href="/tools/lotto-numbers"
        className="text-center text-sm text-zinc-500 hover:text-teal-700"
      >
        나도 번호 뽑아보기 →
      </Link>
    </div>
  );
}
