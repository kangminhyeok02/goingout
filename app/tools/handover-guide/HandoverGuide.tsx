"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import data from "@/data/templates/handover-guide.json";

export function HandoverGuide() {
  const [activeKey, setActiveKey] = useState(data.jobTypes[0].key);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const activeJob = data.jobTypes.find((j) => j.key === activeKey) ?? data.jobTypes[0];

  function toggleCheck(itemKey: string) {
    setChecked((prev) => ({ ...prev, [itemKey]: !prev[itemKey] }));
  }

  async function handleCopyTemplate() {
    try {
      await navigator.clipboard.writeText(data.docTemplate);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {data.jobTypes.map((job) => (
          <button
            key={job.key}
            type="button"
            onClick={() => setActiveKey(job.key)}
            aria-pressed={activeKey === job.key}
            className={`rounded-full px-4 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
              activeKey === job.key
                ? "bg-teal-600 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {job.emoji} {job.label}
          </button>
        ))}
      </div>

      <Card>
        <p className="mb-3 text-sm font-semibold text-zinc-900">
          {activeJob.emoji} {activeJob.label} 인수인계 체크리스트
        </p>
        <ul className="flex flex-col gap-2">
          {activeJob.items.map((item, i) => {
            const itemKey = `${activeJob.key}-${i}`;
            return (
              <li key={itemKey}>
                <label className="flex cursor-pointer items-start gap-2 text-sm text-zinc-700">
                  <input
                    type="checkbox"
                    checked={!!checked[itemKey]}
                    onChange={() => toggleCheck(itemKey)}
                    className="mt-1"
                  />
                  <span className={checked[itemKey] ? "line-through text-zinc-400" : ""}>
                    {item}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-zinc-900">복사용 인수인계서 템플릿</p>
        <pre className="whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm text-zinc-700">
          {data.docTemplate}
        </pre>
        <Button onClick={handleCopyTemplate}>
          {copied ? "복사됐어요 ✓" : "템플릿 복사하기"}
        </Button>
      </Card>

      <Card>
        <p className="mb-3 text-sm font-semibold text-zinc-900">추천 툴</p>
        <ul className="flex flex-col gap-3">
          {data.recommendedTools.map((tool) => (
            <li key={tool.name} className="text-sm">
              <span className="font-medium text-zinc-900">{tool.name}</span>
              <span className="text-zinc-500"> — {tool.description}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
