"use client";

import { useState } from "react";
import { calculateSeverance, type SeveranceResult } from "@/lib/calculators/severance";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Disclaimer } from "@/components/ui/Disclaimer";

function formatWon(value: number): string {
  return `${value.toLocaleString("ko-KR")}원`;
}

export function SeveranceForm() {
  const [hireDate, setHireDate] = useState("");
  const [resignDate, setResignDate] = useState("");
  const [monthlySalary, setMonthlySalary] = useState("");
  const [annualBonus, setAnnualBonus] = useState("");
  const [result, setResult] = useState<SeveranceResult | null>(null);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!hireDate || !resignDate || !monthlySalary) {
      setError("입사일, 퇴사일, 월급은 필수 입력 항목이에요.");
      setResult(null);
      return;
    }
    if (new Date(resignDate) <= new Date(hireDate)) {
      setError("퇴사일은 입사일보다 이후여야 해요.");
      setResult(null);
      return;
    }

    setResult(
      calculateSeverance({
        hireDate,
        resignDate,
        monthlySalary: Number(monthlySalary),
        annualBonus: annualBonus ? Number(annualBonus) : undefined,
      })
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Card className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700">입사일</span>
            <input
              type="date"
              value={hireDate}
              onChange={(e) => setHireDate(e.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700">퇴사(예정)일</span>
            <input
              type="date"
              value={resignDate}
              onChange={(e) => setResignDate(e.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700">월 기준급여 (세전, 원)</span>
            <input
              type="number"
              min={0}
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(e.target.value)}
              placeholder="예: 3500000"
              className="rounded-lg border border-zinc-300 px-3 py-2"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700">
              최근 1년 상여금 총액 (선택, 원)
            </span>
            <input
              type="number"
              min={0}
              value={annualBonus}
              onChange={(e) => setAnnualBonus(e.target.value)}
              placeholder="예: 3000000"
              className="rounded-lg border border-zinc-300 px-3 py-2"
            />
          </label>
        </Card>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit">퇴직금 계산하기</Button>
      </form>

      {result && (
        <Card className="flex flex-col gap-3">
          {result.isEligible ? (
            <>
              <p className="text-sm text-zinc-600">예상 퇴직금</p>
              <p className="text-3xl font-bold text-teal-700">
                {formatWon(result.severancePay)}
              </p>
              <dl className="mt-2 grid grid-cols-2 gap-2 text-sm text-zinc-600">
                <dt>재직 일수</dt>
                <dd className="text-right">{result.workDays.toLocaleString()}일</dd>
                <dt>재직 기간</dt>
                <dd className="text-right">{result.workYears}년</dd>
                <dt>1일 평균임금(추정)</dt>
                <dd className="text-right">{formatWon(result.dailyAverageWage)}</dd>
              </dl>
            </>
          ) : (
            <p className="text-sm text-zinc-700">
              재직 일수가 {result.workDays.toLocaleString()}일로 1년 미만이라
              법정 퇴직금 지급 대상이 아니에요. (근로기준법상 계속근로기간
              1년 이상부터 발생)
            </p>
          )}
          <Disclaimer kinds={["severance", "finance"]} />
        </Card>
      )}
    </div>
  );
}
