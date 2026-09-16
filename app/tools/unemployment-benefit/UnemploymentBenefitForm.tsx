"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Disclaimer } from "@/components/ui/Disclaimer";
import {
  calculateUnemploymentBenefit,
  type SeparationReason,
  type UnemploymentBenefitResult,
} from "@/lib/calculators/unemploymentBenefit";

const REASON_OPTIONS: { key: SeparationReason; label: string }[] = [
  { key: "involuntary", label: "비자발적 (권고사직, 계약만료, 해고 등)" },
  { key: "voluntary_justified", label: "자발적이지만 정당한 사유 (임금체불, 괴롭힘 등)" },
  { key: "voluntary_general", label: "일반적인 자발적 퇴사" },
];

const ELIGIBILITY_CHECKLIST = [
  "이직일 이전 18개월간 고용보험 피보험 단위기간이 합산 180일 이상인가요?",
  "비자발적 이직이거나, 정당한 사유가 인정되는 자발적 이직인가요?",
  "근로 의사와 능력이 있으나 미취업 상태이며, 적극적으로 구직활동을 할 계획인가요?",
  "퇴사 후 지체 없이 워크넷 구직등록과 고용센터 수급자격 인정신청을 할 계획인가요?",
];

function formatWon(n: number): string {
  return `${n.toLocaleString("ko-KR")}원`;
}

export function UnemploymentBenefitForm() {
  const [ageOver50, setAgeOver50] = useState(false);
  const [insuredMonths, setInsuredMonths] = useState("24");
  const [monthlyAverageWage, setMonthlyAverageWage] = useState("3000000");
  const [separationReason, setSeparationReason] =
    useState<SeparationReason>("involuntary");
  const [result, setResult] = useState<UnemploymentBenefitResult | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(
      calculateUnemploymentBenefit({
        ageOver50,
        insuredMonths: Number(insuredMonths) || 0,
        monthlyAverageWage: Number(monthlyAverageWage) || 0,
        separationReason,
      })
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-zinc-900">수급요건 셀프 체크</p>
        <ul className="flex flex-col gap-2">
          {ELIGIBILITY_CHECKLIST.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-zinc-700">
              <span className="mt-0.5 text-teal-600">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Card>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Card className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700">이직 사유</span>
            <select
              value={separationReason}
              onChange={(e) => setSeparationReason(e.target.value as SeparationReason)}
              className="rounded-lg border border-zinc-300 px-3 py-2"
            >
              {REASON_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700">고용보험 가입기간 (개월)</span>
            <input
              type="number"
              min={0}
              value={insuredMonths}
              onChange={(e) => setInsuredMonths(e.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700">
              이직 전 3개월 평균 월급 (세전, 원)
            </span>
            <input
              type="number"
              min={0}
              value={monthlyAverageWage}
              onChange={(e) => setMonthlyAverageWage(e.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2"
            />
          </label>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={ageOver50}
              onChange={(e) => setAgeOver50(e.target.checked)}
            />
            <span>만 50세 이상이에요</span>
          </label>
        </Card>

        <Button type="submit">예상 수급액 계산하기</Button>
      </form>

      {result && (
        <Card className="flex flex-col gap-3">
          {result.isLikelyEligible ? (
            <>
              <p className="text-sm text-zinc-600">
                입력하신 조건으로는 대략 아래와 같이 예상돼요.
              </p>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="rounded-xl bg-teal-50 p-4">
                  <p className="text-xs text-zinc-500">소정급여일수</p>
                  <p className="text-lg font-bold text-teal-700">
                    {result.paymentDays}일
                  </p>
                </div>
                <div className="rounded-xl bg-teal-50 p-4">
                  <p className="text-xs text-zinc-500">1일 구직급여</p>
                  <p className="text-lg font-bold text-teal-700">
                    {formatWon(result.dailyBenefit)}
                  </p>
                </div>
              </div>
              <div className="rounded-xl bg-teal-600 p-4 text-center text-white">
                <p className="text-xs opacity-80">예상 총 수급액</p>
                <p className="text-2xl font-bold">{formatWon(result.totalBenefit)}</p>
              </div>
            </>
          ) : (
            <p className="text-sm text-zinc-700">
              {!result.eligibleByReason &&
                "일반적인 자발적 퇴사는 원칙적으로 실업급여 수급 대상이 아니에요. 다만 정당한 사유가 인정되면 예외가 있을 수 있으니 고용센터에 문의해보세요."}
              {result.eligibleByReason &&
                !result.eligibleByPeriod &&
                "고용보험 가입기간이 부족해 보여요. 최소 180일(약 6개월) 이상 가입되어 있어야 해요."}
            </p>
          )}
        </Card>
      )}

      <Disclaimer kinds={["benefit"]} />
    </div>
  );
}
