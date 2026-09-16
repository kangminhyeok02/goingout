"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { drawLottoCard } from "@/lib/lottoImage";
import { saveOrShareCanvas } from "@/lib/canvasImage";
import { QrShareCard } from "@/components/ui/QrShareCard";

const MESSAGES = [
  "퇴사도 결심했는데, 인생역전이라고 못할 건 없죠.",
  "퇴사 기념으로 운도 한 번 시험해보세요.",
  "이 번호들처럼, 앞날도 새롭게 뽑혀나가길.",
  "숫자는 랜덤이지만, 당신의 다음 선택은 응원할게요.",
  "이번 주는 이 번호로, 다음 주는 새로운 나로.",
];

// 동행복권 실제 공 색상 기준 (1-10 노랑, 11-20 파랑, 21-30 빨강, 31-40 회색, 41-45 초록)
const BALL_COLORS = [
  "bg-yellow-400",
  "bg-sky-400",
  "bg-red-400",
  "bg-zinc-400",
  "bg-emerald-400",
];

function colorFor(n: number): string {
  if (n <= 10) return BALL_COLORS[0];
  if (n <= 20) return BALL_COLORS[1];
  if (n <= 30) return BALL_COLORS[2];
  if (n <= 40) return BALL_COLORS[3];
  return BALL_COLORS[4];
}

function randomBall(): number {
  return Math.floor(Math.random() * 45) + 1;
}

function drawSevenUniqueNumbers(): number[] {
  const pool = Array.from({ length: 45 }, (_, i) => i + 1);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 7);
}

type Phase = "drawing" | "revealing" | "sorted" | "bonus" | "done";

const FLICKER_MS = 900;
const LOCK_INTERVAL_MS = 380;
const SORT_DELAY_MS = 550;
const BONUS_FLICKER_MS = 500;
const BONUS_SETTLE_MS = 450;

const STATUS_LABEL: Record<Phase, string> = {
  drawing: "추첨 준비 중...",
  revealing: "번호를 추첨하고 있습니다...",
  sorted: "당첨번호",
  bonus: "보너스 번호 추첨 중...",
  done: "당첨번호",
};

export function LottoGenerator() {
  const [round, setRound] = useState(0);
  const [drawOrder, setDrawOrder] = useState<number[]>([]);
  const [bonus, setBonus] = useState<number | null>(null);
  const [lockedCount, setLockedCount] = useState(0);
  const [phase, setPhase] = useState<Phase>("drawing");
  const [flickerNumbers, setFlickerNumbers] = useState<number[]>([
    0, 0, 0, 0, 0, 0,
  ]);
  const [bonusFlicker, setBonusFlicker] = useState(0);
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const flickerInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  function clearTimers() {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    if (flickerInterval.current) {
      clearInterval(flickerInterval.current);
      flickerInterval.current = null;
    }
  }

  function schedule(fn: () => void, delay: number) {
    timeouts.current.push(setTimeout(fn, delay));
  }

  function startDraw() {
    clearTimers();
    setRound((r) => r + 1);

    const numbers = drawSevenUniqueNumbers();
    const main = numbers.slice(0, 6);
    const bonusNumber = numbers[6];

    setDrawOrder(main);
    setBonus(bonusNumber);
    setLockedCount(0);
    setPhase("drawing");
    setSaved(false);
    setShareUrl(null);
    setMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);

    flickerInterval.current = setInterval(() => {
      setFlickerNumbers(Array.from({ length: 6 }, randomBall));
      setBonusFlicker(randomBall());
    }, 80);

    schedule(() => {
      setPhase("revealing");
      for (let i = 0; i < 6; i++) {
        schedule(() => setLockedCount((c) => c + 1), i * LOCK_INTERVAL_MS);
      }
      schedule(() => setPhase("sorted"), 6 * LOCK_INTERVAL_MS + SORT_DELAY_MS);
      schedule(() => {
        if (flickerInterval.current) {
          clearInterval(flickerInterval.current);
          flickerInterval.current = null;
        }
        setPhase("bonus");
      }, 6 * LOCK_INTERVAL_MS + SORT_DELAY_MS + BONUS_FLICKER_MS);
      schedule(
        () => setPhase("done"),
        6 * LOCK_INTERVAL_MS + SORT_DELAY_MS + BONUS_FLICKER_MS + BONUS_SETTLE_MS
      );
    }, FLICKER_MS);
  }

  function handleRedraw() {
    startDraw();
  }

  useEffect(() => {
    // Mount-only timer-driven draw animation, not a render-derived state sync.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleRedraw();
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSaveImage() {
    if (phase !== "done" || bonus === null || !canvasRef.current) return;
    const sorted = [...drawOrder].sort((a, b) => a - b);
    drawLottoCard(canvasRef.current, sorted, bonus, message);
    const result = await saveOrShareCanvas(
      canvasRef.current,
      "퇴사-기념-행운번호.png",
      "퇴사 기념 행운번호"
    );
    if (result === "cancelled") return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleShowQr() {
    if (phase !== "done" || bonus === null) return;
    const sorted = [...drawOrder].sort((a, b) => a - b);
    const params = new URLSearchParams({
      n: sorted.join(","),
      b: String(bonus),
      m: message,
    });
    setShareUrl(`${window.location.origin}/tools/lotto-numbers/share?${params.toString()}`);
  }

  const isDrawn = drawOrder.length > 0;
  const isSorted = phase === "sorted" || phase === "bonus" || phase === "done";
  const displayMain = isSorted ? [...drawOrder].sort((a, b) => a - b) : drawOrder;
  const bonusLocked = phase === "bonus" || phase === "done";
  const isSpinning = phase === "drawing" || phase === "revealing";

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col items-center gap-5 overflow-hidden bg-gradient-to-br from-slate-900 to-teal-900 py-8 text-center">
        <div className="flex items-center gap-2 text-teal-300">
          {isSpinning && (
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-teal-300 border-t-transparent" />
          )}
          <p className="text-sm font-medium">{isDrawn ? STATUS_LABEL[phase] : "잠시만 기다려주세요..."}</p>
        </div>

        {isDrawn ? (
          <>
            <div
              key={isSorted ? `sorted-${round}` : `order-${round}`}
              className="flex min-h-14 flex-wrap justify-center gap-3 animate-row-settle"
            >
              {displayMain.map((n, i) => {
                const locked = isSorted || i < lockedCount;
                const value = locked ? n : flickerNumbers[i];
                return (
                  <div
                    key={`${round}-${i}-${locked}`}
                    className={`flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-white shadow-md animate-ball-pop ${
                      locked ? colorFor(value) : "bg-slate-600"
                    }`}
                  >
                    {value}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-slate-400">+</span>
              <div
                key={`bonus-${round}-${bonusLocked}`}
                className={`flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-white shadow-md ring-2 ring-amber-300 animate-ball-pop ${
                  bonusLocked ? colorFor(bonus!) : "bg-slate-600"
                }`}
              >
                {bonusLocked ? bonus : bonusFlicker}
              </div>
            </div>
            <p className="text-xs text-teal-300/70">보너스 번호</p>
          </>
        ) : (
          <div className="flex min-h-14 flex-wrap justify-center gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-14 w-14 rounded-full border-2 border-dashed border-teal-300/40"
              />
            ))}
          </div>
        )}

        {phase === "done" && (
          <p className="max-w-sm text-teal-50 animate-row-settle">{message}</p>
        )}
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
          disabled={phase !== "done"}
        >
          {saved ? "저장됐어요 ✓" : "이미지로 저장하기"}
        </Button>
      </div>

      <Button
        onClick={handleShowQr}
        variant="ghost"
        disabled={phase !== "done"}
      >
        📱 QR로 내 폰에 저장하기
      </Button>

      {shareUrl && <QrShareCard url={shareUrl} />}

      <Disclaimer kinds={["lotto"]} />
    </div>
  );
}
