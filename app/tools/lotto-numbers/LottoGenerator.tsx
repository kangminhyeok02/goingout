"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { drawLottoCard } from "@/lib/lottoImage";
import { downloadCanvasAsPng } from "@/lib/canvasImage";

const MESSAGES = [
  "퇴사도 결심했는데, 인생역전이라고 못할 건 없죠.",
  "퇴사 기념으로 운도 한 번 시험해보세요.",
  "이 번호들처럼, 앞날도 새롭게 뽑혀나가길.",
  "숫자는 랜덤이지만, 당신의 다음 선택은 응원할게요.",
  "이번 주는 이 번호로, 다음 주는 새로운 나로.",
];

const BALL_COLORS = [
  "bg-amber-400",
  "bg-sky-400",
  "bg-red-400",
  "bg-zinc-400",
  "bg-emerald-400",
  "bg-violet-400",
];

function drawNumbers(): number[] {
  const pool = Array.from({ length: 45 }, (_, i) => i + 1);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 6).sort((a, b) => a - b);
}

function colorFor(n: number): string {
  if (n <= 10) return BALL_COLORS[0];
  if (n <= 20) return BALL_COLORS[1];
  if (n <= 30) return BALL_COLORS[2];
  if (n <= 40) return BALL_COLORS[3];
  return BALL_COLORS[4];
}

export function LottoGenerator() {
  const [numbers, setNumbers] = useState<number[] | null>(null);
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    handleRedraw();
  }, []);

  function handleRedraw() {
    setNumbers(drawNumbers());
    setMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
    setSaved(false);
  }

  function handleSaveImage() {
    if (!numbers || !canvasRef.current) return;
    drawLottoCard(canvasRef.current, numbers, message);
    downloadCanvasAsPng(canvasRef.current, "퇴사-기념-행운번호.png");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col items-center gap-6 bg-gradient-to-br from-teal-50 to-amber-50 py-8 text-center">
        <p className="text-sm font-medium text-zinc-500">퇴사 기념 행운 번호</p>
        <div className="flex min-h-12 flex-wrap justify-center gap-3">
          {numbers?.map((n) => (
            <div
              key={n}
              className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white shadow-sm ${colorFor(
                n
              )}`}
            >
              {n}
            </div>
          ))}
        </div>
        <p className="max-w-sm text-zinc-700">{message}</p>
      </Card>

      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button onClick={handleRedraw} className="flex-1">
          번호 다시 뽑기
        </Button>
        <Button
          onClick={handleSaveImage}
          variant="secondary"
          className="flex-1"
          disabled={!numbers}
        >
          {saved ? "저장됐어요 ✓" : "이미지로 저장하기"}
        </Button>
      </div>

      <Disclaimer kinds={["lotto"]} />
    </div>
  );
}
