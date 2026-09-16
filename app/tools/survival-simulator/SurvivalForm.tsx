"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { calculateSurvival, type SurvivalResult } from "@/lib/calculators/survival";
import { Card } from "@/components/ui/Card";
import { Button, LinkButton } from "@/components/ui/Button";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { LineChart } from "@/components/ui/LineChart";

function formatWon(value: number): string {
  return `${value.toLocaleString("ko-KR")}원`;
}

export function SurvivalForm() {
  const searchParams = useSearchParams();
  const [currentSavings, setCurrentSavings] = useState("");
  const [severancePay, setSeverancePay] = useState(
    () => searchParams.get("severancePay") ?? ""
  );
  const [monthlyExpense, setMonthlyExpense] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [result, setResult] = useState<SurvivalResult | null>(null);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!currentSavings || !monthlyExpense) {
      setError("현재 보유 자금과 월 지출은 필수 입력 항목이에요.");
      setResult(null);
      return;
    }

    setResult(
      calculateSurvival({
        currentSavings: Number(currentSavings),
        severancePay: severancePay ? Number(severancePay) : undefined,
        monthlyExpense: Number(monthlyExpense),
        monthlyIncome: monthlyIncome ? Number(monthlyIncome) : undefined,
      })
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Card className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700">현재 보유 자금 (원)</span>
            <input
              type="number"
              min={0}
              value={currentSavings}
              onChange={(e) => setCurrentSavings(e.target.value)}
              placeholder="예: 15000000"
              className="rounded-lg border border-zinc-300 px-3 py-2"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700">예상 퇴직금 (선택, 원)</span>
            <input
              type="number"
              min={0}
              value={severancePay}
              onChange={(e) => setSeverancePay(e.target.value)}
              placeholder="퇴직금 계산기 결과를 입력해보세요"
              className="rounded-lg border border-zinc-300 px-3 py-2"
            />
            {searchParams.get("severancePay") && (
              <span className="text-xs text-teal-600">
                퇴직금 계산기에서 가져온 값이에요. 필요하면 수정해도 돼요.
              </span>
            )}
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700">월 고정 지출 (원)</span>
            <input
              type="number"
              min={0}
              value={monthlyExpense}
              onChange={(e) => setMonthlyExpense(e.target.value)}
              placeholder="예: 2000000"
              className="rounded-lg border border-zinc-300 px-3 py-2"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700">
              퇴사 후 월 예상 수입 (선택, 실업급여 등, 원)
            </span>
            <input
              type="number"
              min={0}
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              placeholder="예: 1800000"
              className="rounded-lg border border-zinc-300 px-3 py-2"
            />
          </label>
        </Card>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit">시뮬레이션 돌려보기</Button>
      </form>

      {result && (
        <Card className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-zinc-600">생존 가능 기간</p>
            <p className="text-3xl font-bold text-teal-700">
              {result.survivalMonths === null
                ? "36개월 이상 (지출보다 수입이 많아요)"
                : `약 ${result.survivalMonths}개월`}
            </p>
          </div>
          <LineChart
            points={result.timeline.map((p) => ({ x: p.month, y: p.balance }))}
            yFormatter={(v) => `${Math.round(v / 10000).toLocaleString()}만`}
            xLabel="개월 경과에 따른 잔고 변화"
          />
          <p className="text-xs text-zinc-500">
            가로축: 경과 개월 / 세로축: 예상 잔고 · 시작 자금{" "}
            {formatWon(result.totalStartingFunds)}, 월 순지출{" "}
            {formatWon(result.netMonthlyBurn)} 기준
          </p>
          <Disclaimer kinds={["finance"]} />
          <LinkButton href="/tools/boss-compatibility" variant="secondary">
            상사 궁합 테스트도 해보기 →
          </LinkButton>
        </Card>
      )}
    </div>
  );
}
