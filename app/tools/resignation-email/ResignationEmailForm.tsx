"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import templates from "@/data/templates/resignation-email.json";

type ToneKey = "formal" | "casual";
type RecipientKey = "team" | "manager";

function fillTemplate(
  template: string,
  vars: Record<string, string>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? "");
}

export function ResignationEmailForm() {
  const [tone, setTone] = useState<ToneKey>("formal");
  const [recipient, setRecipient] = useState<RecipientKey>("team");
  const [name, setName] = useState("");
  const [lastDay, setLastDay] = useState("");
  const [managerTitle, setManagerTitle] = useState("팀장");
  const [copied, setCopied] = useState(false);

  const templateKey = `${tone}_${recipient}` as keyof typeof templates.templates;
  const template = templates.templates[templateKey];

  const vars = useMemo(
    () => ({
      name: name || "OOO",
      lastDay: lastDay || "YYYY년 MM월 DD일",
      managerTitle: managerTitle || "팀장",
    }),
    [name, lastDay, managerTitle]
  );

  const subject = fillTemplate(template.subject, vars);
  const body = fillTemplate(template.body, vars);

  async function handleCopy() {
    const text = `제목: ${subject}\n\n${body}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col gap-4">
        <div>
          <p className="mb-2 text-sm font-medium text-zinc-700">톤</p>
          <div className="flex gap-2">
            {templates.tones.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTone(t.key as ToneKey)}
                aria-pressed={tone === t.key}
                className={`rounded-full px-4 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
                  tone === t.key
                    ? "bg-teal-600 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-zinc-700">받는 사람</p>
          <div className="flex gap-2">
            {templates.recipients.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRecipient(r.key as RecipientKey)}
                aria-pressed={recipient === r.key}
                className={`rounded-full px-4 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
                  recipient === r.key
                    ? "bg-teal-600 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-700">내 이름</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 홍길동"
            className="rounded-lg border border-zinc-300 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-700">마지막 근무일</span>
          <input
            type="date"
            value={lastDay}
            onChange={(e) => setLastDay(e.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2"
          />
        </label>
        {recipient === "manager" && (
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700">상사 직함</span>
            <input
              value={managerTitle}
              onChange={(e) => setManagerTitle(e.target.value)}
              placeholder="예: 팀장, 실장"
              className="rounded-lg border border-zinc-300 px-3 py-2"
            />
          </label>
        )}
      </Card>

      <Card className="flex flex-col gap-3">
        <p className="text-sm font-medium text-zinc-700">미리보기</p>
        <div className="rounded-lg bg-zinc-50 p-4 text-sm">
          <p className="mb-2 font-semibold">{subject}</p>
          <p className="whitespace-pre-wrap text-zinc-700">{body}</p>
        </div>
        <Button type="button" onClick={handleCopy}>
          {copied ? "복사됐어요 ✓" : "메일 내용 복사하기"}
        </Button>
      </Card>
    </div>
  );
}
