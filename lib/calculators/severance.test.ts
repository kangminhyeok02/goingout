import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateSeverance } from "./severance.ts";

test("1년 미만 근무는 퇴직금 미지급", () => {
  const result = calculateSeverance({
    hireDate: "2025-01-01",
    resignDate: "2025-06-01",
    monthlySalary: 3000000,
  });
  assert.equal(result.isEligible, false);
  assert.equal(result.severancePay, 0);
});

test("정확히 1년 근무 시 월급 1개월치 근사", () => {
  const result = calculateSeverance({
    hireDate: "2023-01-01",
    resignDate: "2024-01-01",
    monthlySalary: 3000000,
  });
  assert.equal(result.isEligible, true);
  // 365일 근무 => workYears ~= 1, severance ~= dailyWage * 30
  assert.ok(Math.abs(result.severancePay - 3000000) < 20000);
});

test("상여금 포함 시 퇴직금이 더 커진다", () => {
  const base = calculateSeverance({
    hireDate: "2020-01-01",
    resignDate: "2024-01-01",
    monthlySalary: 4000000,
  });
  const withBonus = calculateSeverance({
    hireDate: "2020-01-01",
    resignDate: "2024-01-01",
    monthlySalary: 4000000,
    annualBonus: 6000000,
  });
  assert.ok(withBonus.severancePay > base.severancePay);
});
