import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateUnemploymentBenefit } from "./unemploymentBenefit.ts";

test("일반 자발적 퇴사는 수급 대상이 아니다", () => {
  const result = calculateUnemploymentBenefit({
    ageOver50: false,
    insuredMonths: 24,
    monthlyAverageWage: 3000000,
    separationReason: "voluntary_general",
  });
  assert.equal(result.isLikelyEligible, false);
  assert.equal(result.totalBenefit, 0);
});

test("가입기간이 6개월 미만이면 수급 대상이 아니다", () => {
  const result = calculateUnemploymentBenefit({
    ageOver50: false,
    insuredMonths: 3,
    monthlyAverageWage: 3000000,
    separationReason: "involuntary",
  });
  assert.equal(result.eligibleByPeriod, false);
  assert.equal(result.isLikelyEligible, false);
});

test("50세 이상은 동일 가입기간에서 소정급여일수가 더 많다", () => {
  const under50 = calculateUnemploymentBenefit({
    ageOver50: false,
    insuredMonths: 48,
    monthlyAverageWage: 3000000,
    separationReason: "involuntary",
  });
  const over50 = calculateUnemploymentBenefit({
    ageOver50: true,
    insuredMonths: 48,
    monthlyAverageWage: 3000000,
    separationReason: "involuntary",
  });
  assert.ok(over50.paymentDays > under50.paymentDays);
});

test("고액 급여는 1일 구직급여가 상한액에서 막힌다", () => {
  const result = calculateUnemploymentBenefit({
    ageOver50: false,
    insuredMonths: 24,
    monthlyAverageWage: 20000000,
    separationReason: "involuntary",
  });
  assert.equal(result.dailyBenefit, 66000);
});
