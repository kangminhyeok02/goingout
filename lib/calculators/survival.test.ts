import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateSurvival } from "./survival.ts";

test("지출이 0이면 무한 생존(survivalMonths=null)", () => {
  const result = calculateSurvival({
    currentSavings: 1000000,
    monthlyExpense: 500000,
    monthlyIncome: 500000,
  });
  assert.equal(result.survivalMonths, null);
});

test("자금이 정확히 소진되는 달을 계산한다", () => {
  const result = calculateSurvival({
    currentSavings: 3000000,
    monthlyExpense: 1000000,
  });
  assert.equal(result.survivalMonths, 3);
});

test("퇴직금 포함 시 생존 개월수가 늘어난다", () => {
  const without = calculateSurvival({
    currentSavings: 3000000,
    monthlyExpense: 1000000,
  });
  const withSeverance = calculateSurvival({
    currentSavings: 3000000,
    severancePay: 3000000,
    monthlyExpense: 1000000,
  });
  assert.ok((withSeverance.survivalMonths ?? 0) > (without.survivalMonths ?? 0));
});
