"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import data from "@/data/templates/corporate-jargon.json";

export function JargonTranslator() {
  const [query, setQuery] = useState("");
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [todayIndex, setTodayIndex] = useState<number | null>(null);

  function pickTodayEntry() {
    setTodayIndex(Math.floor(Math.random() * data.entries.length));
  }

  useEffect(() => {
    // 서버 렌더링 시점엔 난수를 쓸 수 없어 hydration mismatch를 피하려고 effect에서 설정한다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    pickTodayEntry();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return data.entries.map((entry, i) => ({ entry, index: i }));
    return data.entries
      .map((entry, i) => ({ entry, index: i }))
      .filter(
        ({ entry }) =>
          entry.phrase.includes(q) || entry.meaning.includes(q)
      );
  }, [query]);

  function toggle(index: number) {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  const todayEntry = todayIndex !== null ? data.entries[todayIndex] : null;

  return (
    <div className="flex flex-col gap-6">
      {todayEntry && (
        <Card className="flex flex-col gap-2 bg-gradient-to-br from-violet-50 to-teal-50">
          <p className="text-xs font-medium text-zinc-500">오늘의 은어</p>
          <p className="text-lg font-semibold text-zinc-900">
            &ldquo;{todayEntry.phrase}&rdquo;
          </p>
          <p className="text-sm text-teal-700">→ {todayEntry.meaning}</p>
        </Card>
      )}

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="키워드로 찾아보기 (예: 회의, 일정)"
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {filtered.map(({ entry, index }) => {
          const isRevealed = revealed.has(index);
          return (
            <button
              key={index}
              type="button"
              onClick={() => toggle(index)}
              className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow-sm transition-all hover:border-teal-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              <p className="text-sm font-medium text-zinc-900">
                &ldquo;{entry.phrase}&rdquo;
              </p>
              {isRevealed ? (
                <p className="text-sm text-teal-700">→ {entry.meaning}</p>
              ) : (
                <p className="text-xs text-zinc-400">탭해서 진짜 의미 보기</p>
              )}
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="col-span-full py-6 text-center text-sm text-zinc-400">
            일치하는 문구가 없어요. 다른 키워드로 찾아보세요.
          </p>
        )}
      </div>

      <p className="text-xs text-zinc-500">
        재미로 보는 콘텐츠예요. 특정 회사나 사람을 겨냥한 내용이 아니라,
        누구나 한 번쯤 들어봤을 법한 표현들을 모았어요.
      </p>
    </div>
  );
}
