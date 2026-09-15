import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateSchedule } from "./schedule.ts";

test("기본 30일 통보 기준으로 통보일을 역산한다", () => {
  const result = calculateSchedule({ desiredLastDay: "2026-03-31" });
  assert.equal(result.latestNoticeDate, "2026-03-01");
  assert.equal(result.lastWorkDay, "2026-03-31");
});

test("인수인계 기간을 지정하면 시작일이 달라진다", () => {
  const result = calculateSchedule({
    desiredLastDay: "2026-03-31",
    handoverDays: 7,
  });
  assert.equal(result.handoverStartDate, "2026-03-24");
});

test("오늘 기준 통보일까지 남은 일수를 계산한다", () => {
  const result = calculateSchedule(
    { desiredLastDay: "2026-04-30" },
    new Date("2026-03-01T00:00:00")
  );
  // latestNoticeDate = 2026-03-31, today = 2026-03-01 -> 30일 남음
  assert.equal(result.daysUntilNotice, 30);
});
