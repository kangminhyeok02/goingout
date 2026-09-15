"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { downloadCanvasAsPng } from "@/lib/canvasImage";
import { drawQuoteCard } from "@/lib/quoteCardImage";
import data from "@/data/templates/resignation-quotes.json";

export function QuoteCardGenerator() {
  const [quote, setQuote] = useState<string | null>(null);
  const [useCustom, setUseCustom] = useState(false);
  const [customText, setCustomText] = useState("");
  const [themeKey, setThemeKey] = useState(data.themes[0].key);
  const [saved, setSaved] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    pickRandomQuote();
  }, []);

  function pickRandomQuote() {
    const next = data.quotes[Math.floor(Math.random() * data.quotes.length)];
    setQuote(next);
    setUseCustom(false);
    setSaved(false);
  }

  const theme = data.themes.find((t) => t.key === themeKey) ?? data.themes[0];
  const displayedQuote = useCustom
    ? customText.trim() || "나만의 한마디를 적어보세요"
    : quote ?? "";

  function handleSaveImage() {
    if (!canvasRef.current) return;
    drawQuoteCard(canvasRef.current, displayedQuote, theme);
    downloadCanvasAsPng(canvasRef.current, "퇴사-명언-카드.png");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col gap-6">
      <Card
        className="flex min-h-[220px] flex-col items-center justify-center gap-3 p-8 text-center"
        style={{
          background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
        }}
      >
        <p className="text-xs font-semibold opacity-60" style={{ color: theme.text }}>
          슬기로운 퇴사생활
        </p>
        <p
          className="whitespace-pre-wrap text-xl font-bold leading-relaxed"
          style={{ color: theme.text }}
        >
          {displayedQuote}
        </p>
      </Card>

      <div className="flex flex-wrap gap-2">
        {data.themes.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setThemeKey(t.key)}
            aria-pressed={themeKey === t.key}
            className={`rounded-full px-3 py-1.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
              themeKey === t.key
                ? "bg-teal-600 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <Button onClick={pickRandomQuote} variant="secondary" className="flex-1">
          다른 문구 보기
        </Button>
        <Button
          onClick={() => setUseCustom((v) => !v)}
          variant={useCustom ? "primary" : "secondary"}
          className="flex-1"
        >
          {useCustom ? "직접 쓰는 중" : "내가 직접 쓰기"}
        </Button>
      </div>

      {useCustom && (
        <textarea
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="나만의 한마디를 적어보세요"
          rows={3}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
      )}

      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      <Button onClick={handleSaveImage} disabled={!displayedQuote}>
        {saved ? "저장됐어요 ✓" : "이미지로 저장하기"}
      </Button>

      <p className="text-xs text-zinc-500">
        참고용 문구이며 재미로 즐기는 콘텐츠입니다.
      </p>
    </div>
  );
}
