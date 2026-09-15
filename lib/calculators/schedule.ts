export interface ScheduleInput {
  desiredLastDay: string; // 희망 마지막 근무일, YYYY-MM-DD
  noticeDays?: number; // 통보 필요 일수 (기본 30일)
  handoverDays?: number; // 희망 인수인계 기간 (기본 14일)
}

export interface ScheduleTimelineItem {
  key: "notice" | "handoverStart" | "lastDay";
  label: string;
  date: string; // YYYY-MM-DD
}

export interface ScheduleResult {
  latestNoticeDate: string; // 이 날짜까지는 통보해야 함
  handoverStartDate: string;
  lastWorkDay: string;
  daysUntilNotice: number; // 오늘 기준 통보일까지 남은 일수 (음수면 이미 지남)
  timeline: ScheduleTimelineItem[];
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function calculateSchedule(
  input: ScheduleInput,
  today: Date = new Date()
): ScheduleResult {
  const noticeDays = input.noticeDays ?? 30;
  const handoverDays = input.handoverDays ?? 14;
  const lastDay = new Date(input.desiredLastDay);

  const latestNoticeDate = addDays(lastDay, -noticeDays);
  const handoverStartDate = addDays(lastDay, -handoverDays);

  const todayMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const daysUntilNotice = Math.round(
    (latestNoticeDate.getTime() - todayMidnight.getTime()) / MS_PER_DAY
  );

  return {
    latestNoticeDate: toDateString(latestNoticeDate),
    handoverStartDate: toDateString(handoverStartDate),
    lastWorkDay: toDateString(lastDay),
    daysUntilNotice,
    timeline: [
      { key: "notice", label: "늦어도 이 날까지 통보", date: toDateString(latestNoticeDate) },
      { key: "handoverStart", label: "인수인계 시작 권장일", date: toDateString(handoverStartDate) },
      { key: "lastDay", label: "마지막 근무일", date: toDateString(lastDay) },
    ],
  };
}
