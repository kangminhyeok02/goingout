"use client";

import { useState } from "react";
import { calculateSchedule, type ScheduleResult } from "@/lib/calculators/schedule";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export function SchedulePlannerForm() {
  const [desiredLastDay, setDesiredLastDay] = useState("");
  const [noticeDays, setNoticeDays] = useState("30");
  const [handoverDays, setHandoverDays] = useState("14");
  const [result, setResult] = useState<ScheduleResult | null>(null);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!desiredLastDay) {
      setError("희망하는 마지막 근무일을 입력해주세요.");
      setResult(null);
      return;
    }

    setResult(
      calculateSchedule({
        desiredLastDay,
        noticeDays: Number(noticeDays) || 30,
        handoverDays: Number(handoverDays) || 14,
      })
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Card className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700">희망 마지막 근무일</span>
            <input
              type="date"
              value={desiredLastDay}
              onChange={(e) => setDesiredLastDay(e.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700">
              필요한 통보 기간 (일, 회사 규정/근로계약 확인)
            </span>
            <input
              type="number"
              min={0}
              value={noticeDays}
              onChange={(e) => setNoticeDays(e.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700">희망 인수인계 기간 (일)</span>
            <input
              type="number"
              min={0}
              value={handoverDays}
              onChange={(e) => setHandoverDays(e.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2"
            />
          </label>
        </Card>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit">일정 계산하기</Button>
      </form>

      {result && (
        <Card className="flex flex-col gap-4">
          <p className="text-sm text-zinc-600">
            {result.daysUntilNotice >= 0
              ? `늦어도 통보일까지 ${result.daysUntilNotice}일 남았어요.`
              : `통보 권장일이 이미 ${Math.abs(result.daysUntilNotice)}일 지났어요. 서둘러 통보를 준비해보세요.`}
          </p>
          <ol className="flex flex-col gap-3">
            {result.timeline.map((item, i) => (
              <li key={item.key} className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900">
                    {item.label}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {formatDateLabel(item.date)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <p className="text-xs text-zinc-500">
            통보 기간은 회사 취업규칙이나 근로계약서에 따라 다를 수 있어요.
            민법상 기본 원칙은 1개월이지만, 원만한 인수인계를 위해 실제
            규정을 먼저 확인해보세요.
          </p>
        </Card>
      )}
    </div>
  );
}
