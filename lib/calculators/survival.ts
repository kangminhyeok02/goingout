export interface SurvivalInput {
  currentSavings: number; // 현재 보유 자금, 원
  severancePay?: number; // 예상 퇴직금, 원 (선택)
  monthlyExpense: number; // 월 고정 지출, 원
  monthlyIncome?: number; // 퇴사 후 월 예상 수입 (실업급여 등), 원 (선택)
  maxMonths?: number; // 시뮬레이션 최대 개월 수 (기본 36)
}

export interface SurvivalMonthPoint {
  month: number;
  balance: number;
}

export interface SurvivalResult {
  totalStartingFunds: number;
  netMonthlyBurn: number;
  survivalMonths: number | null; // null이면 자금이 소진되지 않음(무한 생존)
  timeline: SurvivalMonthPoint[];
}

export function calculateSurvival(input: SurvivalInput): SurvivalResult {
  const totalStartingFunds =
    Math.max(0, input.currentSavings) + Math.max(0, input.severancePay ?? 0);
  const netMonthlyBurn = Math.max(
    0,
    input.monthlyExpense - (input.monthlyIncome ?? 0)
  );
  const maxMonths = input.maxMonths ?? 36;

  const timeline: SurvivalMonthPoint[] = [
    { month: 0, balance: totalStartingFunds },
  ];

  let survivalMonths: number | null = null;
  let balance = totalStartingFunds;

  for (let month = 1; month <= maxMonths; month++) {
    balance = Math.round(balance - netMonthlyBurn);
    timeline.push({ month, balance });
    if (netMonthlyBurn > 0 && balance <= 0 && survivalMonths === null) {
      survivalMonths = month;
    }
  }

  return {
    totalStartingFunds,
    netMonthlyBurn,
    survivalMonths,
    timeline,
  };
}
