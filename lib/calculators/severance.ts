export interface SeveranceInput {
  hireDate: string; // YYYY-MM-DD
  resignDate: string; // YYYY-MM-DD
  monthlySalary: number; // 기준 월급(세전), 원
  annualBonus?: number; // 최근 1년간 상여금 총액, 원 (선택)
}

export interface SeveranceResult {
  workDays: number;
  workYears: number;
  isEligible: boolean;
  dailyAverageWage: number;
  severancePay: number;
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function calculateSeverance(input: SeveranceInput): SeveranceResult {
  const hire = new Date(input.hireDate);
  const resign = new Date(input.resignDate);

  const workDays = Math.max(
    0,
    Math.round((resign.getTime() - hire.getTime()) / MS_PER_DAY)
  );
  const workYears = workDays / 365;
  const isEligible = workDays >= 365;

  // 평균임금 = (최근 3개월 급여 합계 + 최근 1년 상여금 중 3개월분) / 3개월 일수(약 90일)
  const threeMonthBonus = ((input.annualBonus ?? 0) / 12) * 3;
  const normalizedDailyWage = (input.monthlySalary * 3 + threeMonthBonus) / 90;

  const severancePay = isEligible
    ? Math.round(normalizedDailyWage * 30 * workYears)
    : 0;

  return {
    workDays,
    workYears: Math.round(workYears * 100) / 100,
    isEligible,
    dailyAverageWage: Math.round(normalizedDailyWage),
    severancePay,
  };
}
