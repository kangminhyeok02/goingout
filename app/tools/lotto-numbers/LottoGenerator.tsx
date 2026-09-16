"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { drawLottoCard, hexForNumber } from "@/lib/lottoImage";
import { saveOrShareCanvas } from "@/lib/canvasImage";
import { QrShareCard } from "@/components/ui/QrShareCard";

const MESSAGES = [
  "퇴사도 결심했는데, 인생역전이라고 못할 건 없죠.",
  "퇴사 기념으로 운도 한 번 시험해보세요.",
  "이 번호들처럼, 앞날도 새롭게 뽑혀나가길.",
  "숫자는 랜덤이지만, 당신의 다음 선택은 응원할게요.",
  "이번 주는 이 번호로, 다음 주는 새로운 나로.",
];

const MINI_BALL_COUNT = 14;
const MINI_BALL_COLORS = ["#5eead4", "#2dd4bf", "#99f6e4", "#fbbf24", "#7dd3fc"];
const DRUM_SIZE = 150;
const MINI_BALL_SIZE = 14;
const DRUM_MIN = 4;
const DRUM_MAX = DRUM_SIZE - MINI_BALL_SIZE - DRUM_MIN;
const SLOT_COUNT = 7; // 본번호 6개 + 보너스 1개

function randomPos() {
  return {
    x: DRUM_MIN + Math.random() * (DRUM_MAX - DRUM_MIN),
    y: DRUM_MIN + Math.random() * (DRUM_MAX - DRUM_MIN),
  };
}

export function LottoGenerator() {
  const [drawn, setDrawn] = useState<number[]>([]); // 뽑힌 순서 그대로, 마지막 원소가 보너스
  const [message, setMessage] = useState("");
  const [pulling, setPulling] = useState(false);
  const [settled, setSettled] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const drumBallsRef = useRef<HTMLDivElement>(null);
  const chuteRef = useRef<HTMLDivElement>(null);
  const leverArmRef = useRef<HTMLSpanElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const burstingRef = useRef(false);
  const stoppedRef = useRef(false);
  const drawnRef = useRef<number[]>([]);

  const filledCount = drawn.length;
  const isDone = filledCount === SLOT_COUNT && settled;

  useEffect(() => {
    // 서버 렌더와 다른 난수를 뽑아야 하므로 마운트 이후에만 정한다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
  }, []);

  // 드럼 안을 계속 떠다니는 미니 공들. React 상태와 무관한 순수 장식 애니메이션이라
  // GSAP로 직접 DOM을 다루고, 언마운트 시 stoppedRef로 재귀 예약을 끊고 트윈을 제거한다.
  useEffect(() => {
    const container = drumBallsRef.current;
    if (!container) return;
    stoppedRef.current = false;
    container.innerHTML = "";
    const balls: HTMLDivElement[] = [];

    function roam(el: HTMLDivElement) {
      if (stoppedRef.current) return;
      const target = randomPos();
      const duration = burstingRef.current
        ? 0.16 + Math.random() * 0.1
        : 0.9 + Math.random() * 0.9;
      gsap.to(el, {
        left: `${target.x}px`,
        top: `${target.y}px`,
        duration,
        ease: "sine.inOut",
        onComplete: () => roam(el),
      });
    }

    for (let i = 0; i < MINI_BALL_COUNT; i++) {
      const mini = document.createElement("div");
      mini.className = "absolute rounded-full opacity-80";
      mini.style.width = `${MINI_BALL_SIZE}px`;
      mini.style.height = `${MINI_BALL_SIZE}px`;
      mini.style.background = MINI_BALL_COLORS[i % MINI_BALL_COLORS.length];
      mini.style.boxShadow = "0 0 6px rgba(0,0,0,0.25)";
      const start = randomPos();
      mini.style.left = `${start.x}px`;
      mini.style.top = `${start.y}px`;
      container.appendChild(mini);
      balls.push(mini);
      roam(mini);
    }

    return () => {
      stoppedRef.current = true;
      gsap.killTweensOf(balls);
      container.innerHTML = "";
    };
  }, []);

  function flyBallToSlot(number: number, slotIndex: number, onLanded?: () => void) {
    const chute = chuteRef.current;
    const slot = slotRefs.current[slotIndex];
    if (!chute || !slot) return;

    const chuteRect = chute.getBoundingClientRect();
    const slotRect = slot.getBoundingClientRect();
    const color = hexForNumber(number);

    const flying = document.createElement("div");
    flying.textContent = String(number);
    flying.style.position = "fixed";
    flying.style.zIndex = "60";
    flying.style.pointerEvents = "none";
    flying.style.display = "flex";
    flying.style.alignItems = "center";
    flying.style.justifyContent = "center";
    flying.style.width = "44px";
    flying.style.height = "44px";
    flying.style.borderRadius = "9999px";
    flying.style.fontWeight = "700";
    flying.style.fontSize = "15px";
    flying.style.color = "#ffffff";
    flying.style.background = color;
    flying.style.left = `${chuteRect.left + chuteRect.width / 2 - 22}px`;
    flying.style.top = `${chuteRect.top}px`;
    document.body.appendChild(flying);

    gsap.fromTo(
      flying,
      { scale: 0.4, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.2 }
    );

    gsap.to(flying, {
      left: slotRect.left,
      top: slotRect.top,
      rotate: 360,
      duration: 0.55,
      ease: "power2.in",
      onComplete: () => {
        flying.remove();
        slot.classList.remove("border-2", "border-dashed");
        slot.style.background = color;
        slot.textContent = String(number);
        gsap.fromTo(
          slot,
          { scale: 1.3 },
          {
            scale: 1,
            duration: 0.25,
            ease: "back.out(2)",
            onComplete: onLanded,
          }
        );
      },
    });
  }

  function pickNextNumber(current: number[]): number {
    let n: number;
    do {
      n = 1 + Math.floor(Math.random() * 45);
    } while (current.includes(n));
    return n;
  }

  function drawOne(): Promise<void> {
    return new Promise((resolve) => {
      burstingRef.current = true;

      gsap
        .timeline()
        .to(leverArmRef.current, { rotate: -38, duration: 0.18, ease: "power1.out" })
        .to(leverArmRef.current, {
          rotate: 0,
          duration: 0.35,
          ease: "elastic.out(1, 0.5)",
        });

      setTimeout(() => {
        burstingRef.current = false;
        const next = pickNextNumber(drawnRef.current);
        const nextDrawn = [...drawnRef.current, next];
        drawnRef.current = nextDrawn;
        setDrawn(nextDrawn);
        const isLast = nextDrawn.length >= SLOT_COUNT;
        flyBallToSlot(next, nextDrawn.length - 1, () => {
          if (isLast) setSettled(true);
          resolve();
        });
      }, 550);
    });
  }

  async function pullLever() {
    if (pulling || isDone) return;
    setPulling(true);
    await drawOne();
    setPulling(false);
  }

  async function handleDrawAll() {
    if (pulling || isDone) return;
    setPulling(true);
    while (drawnRef.current.length < SLOT_COUNT) {
      await drawOne();
    }
    setPulling(false);
  }

  function handleReset() {
    drawnRef.current = [];
    setDrawn([]);
    setSettled(false);
    setSaved(false);
    setShareUrl(null);
    setPulling(false);
    setMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
    slotRefs.current.forEach((slot) => {
      if (!slot) return;
      slot.textContent = "?";
      slot.style.background = "";
      slot.classList.add("border-2", "border-dashed");
    });
  }

  async function handleSaveImage() {
    if (!isDone || !canvasRef.current) return;
    const main = drawn.slice(0, 6);
    const bonus = drawn[6];
    const sorted = [...main].sort((a, b) => a - b);
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
    if (!isDone) return;
    const main = drawn.slice(0, 6);
    const bonus = drawn[6];
    const sorted = [...main].sort((a, b) => a - b);
    const params = new URLSearchParams({
      n: sorted.join(","),
      b: String(bonus),
      m: message,
    });
    setShareUrl(`${window.location.origin}/tools/lotto-numbers/share?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col items-center gap-5 overflow-hidden bg-gradient-to-br from-slate-900 to-teal-900 py-8 text-center">
        <p className="max-w-xs text-sm text-teal-100">
          레버를 당길 때마다 공이 하나씩 나와요. 6개를 다 채우면 보너스 번호까지 뽑아드려요!
          한 번에 다 뽑고 싶다면 아래 버튼을 눌러보세요.
        </p>
        <p className="text-xs font-semibold text-teal-300">{filledCount} / {SLOT_COUNT}</p>

        <div className="flex flex-col items-center gap-4">
          <div
            className="relative overflow-hidden rounded-full border-4 border-teal-300/40"
            style={{
              width: DRUM_SIZE,
              height: DRUM_SIZE,
              background:
                "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15), rgba(15,23,42,0.9))",
            }}
          >
            <div ref={drumBallsRef} className="absolute inset-0" />
            <div
              ref={chuteRef}
              className="absolute bottom-[-2px] left-1/2 h-3.5 w-7 -translate-x-1/2 rounded-b-lg bg-slate-900"
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={pullLever}
              disabled={pulling || isDone}
              aria-label="레버 당기기"
              className="flex flex-col items-center gap-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span
                ref={leverArmRef}
                className="relative block h-14 w-2 origin-bottom rounded bg-gradient-to-b from-zinc-100 to-zinc-400"
              >
                <span className="absolute -top-2.5 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-red-500 shadow" />
              </span>
              <span className="-mt-0.5 h-3.5 w-10 rounded-md bg-zinc-600" />
            </button>

            {filledCount === 0 && (
              <div className="pointer-events-none absolute left-full top-1 ml-2 flex animate-bounce items-center gap-1 whitespace-nowrap rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-amber-900 shadow-lg">
                👈 눌러서 뽑기
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleDrawAll}
            disabled={pulling || isDone}
            className="rounded-full border border-teal-300/40 px-4 py-1.5 text-xs font-medium text-teal-200 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ⚡ 한 번에 다 뽑기
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              ref={(el) => {
                slotRefs.current[i] = el;
              }}
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-dashed border-teal-300/40 text-lg font-bold text-white/70 shadow-md"
            >
              ?
            </div>
          ))}
          <span className="flex items-center text-2xl font-bold text-slate-400">+</span>
          <div
            ref={(el) => {
              slotRefs.current[6] = el;
            }}
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-dashed border-amber-300/50 text-lg font-bold text-white/70 shadow-md ring-2 ring-amber-300/60"
          >
            ?
          </div>
        </div>

        {isDone && <p className="max-w-sm text-teal-50 animate-row-settle">{message}</p>}
      </Card>

      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button onClick={handleReset} className="flex-1">
          다시 뽑기
        </Button>
        <Button
          onClick={handleSaveImage}
          variant="secondary"
          className="flex-1"
          disabled={!isDone}
        >
          {saved ? "저장됐어요 ✓" : "이미지로 저장하기"}
        </Button>
      </div>

      <Button onClick={handleShowQr} variant="ghost" disabled={!isDone}>
        📱 QR로 내 폰에 저장하기
      </Button>

      {shareUrl && <QrShareCard url={shareUrl} />}

      <Disclaimer kinds={["lotto"]} />
    </div>
  );
}
