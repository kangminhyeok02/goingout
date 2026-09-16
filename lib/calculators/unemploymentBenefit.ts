export type SeparationReason =
  | "involuntary" // 권고사직, 계약만료, 해고 등 비자발적 이직
  | "voluntary_justified" // 임금체불, 괴롭힘 등 정당한 사유의 자발적 이직
  | "voluntary_general"; // 일반적인 자발적 이직 (원칙적으로 수급 불가)

export interface UnemploymentBenefitInput {
  ageOver50: boolean;
  insuredMonths: number; // 피보험(고용보험 가입) 기간, 개월
  monthlyAverageWage: number; // 이직 전 3개월 평균 월급(세전), 원
  separationReason: SeparationReason;
}

export interface UnemploymentBenefitResult {
  eligibleByReason: boolean;
  eligibleByPeriod: boolean;
  isLikelyEligible: boolean;
  paymentDays: number;
  dailyBenefit: number;
  totalBenefit: number;
}

// 최소 피보험 단위기간 요건(180일) ≈ 6개월로 근사
const MIN_INSURED_MONTHS = 6;

// 일 구직급여 상한액(원). 매년 고시로 바뀔 수 있어 참고용으로만 사용.
const DAILY_BENEFIT_CAP = 66000;
const BENEFIT_RATE = 0.6;

// 소정급여일수 표 (가입기간, 50세 미만 일수, 50세 이상·장애인 일수)
const PAYMENT_DAYS_TABLE: {
  maxMonths: number;
  under50: number;
  over50: number;
}[] = [
  { maxMonths: 12, under50: 120, over50: 120 },
  { maxMonths: 36, under50: 150, over50: 180 },
  { maxMonths: 60, under50: 180, over50: 210 },
  { maxMonths: 120, under50: 210, over50: 240 },
  { maxMonths: Infinity, under50: 240, over50: 270 },
];

function getPaymentDays(insuredMonths: number, ageOver50: boolean): number {
  const bucket =
    PAYMENT_DAYS_TABLE.find((b) => insuredMonths < b.maxMonths) ??
    PAYMENT_DAYS_TABLE[PAYMENT_DAYS_TABLE.length - 1];
  return ageOver50 ? bucket.over50 : bucket.under50;
}

export function calculateUnemploymentBenefit(
  input: UnemploymentBenefitInput
): UnemploymentBenefitResult {
  const eligibleByReason = input.separationReason !== "voluntary_general";
  const eligibleByPeriod = input.insuredMonths >= MIN_INSURED_MONTHS;
  const isLikelyEligible = eligibleByReason && eligibleByPeriod;

  const paymentDays = getPaymentDays(input.insuredMonths, input.ageOver50);
  const dailyWage = input.monthlyAverageWage / 30;
  const dailyBenefit = Math.min(
    Math.round(dailyWage * BENEFIT_RATE),
    DAILY_BENEFIT_CAP
  );
  const totalBenefit = isLikelyEligible ? dailyBenefit * paymentDays : 0;

  return {
    eligibleByReason,
    eligibleByPeriod,
    isLikelyEligible,
    paymentDays,
    dailyBenefit,
    totalBenefit,
  };
}
