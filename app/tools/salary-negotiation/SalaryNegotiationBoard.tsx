"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import data from "@/data/templates/salary-negotiation.json";

export function SalaryNegotiationBoard() {
  const [activeKey, setActiveKey] = useState(data.situations[0].key);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  function toggleCheck(itemKey: string) {
    setChecked((prev) => ({ ...prev, [itemKey]: !prev[itemKey] }));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {data.situations.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setActiveKey(s.key)}
            aria-pressed={activeKey === s.key}
            className={`rounded-full px-4 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
              activeKey === s.key
                ? "bg-teal-600 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {data.situations
        .filter((s) => s.key === activeKey)
        .map((s) => (
          <div key={s.key} className="flex flex-col gap-4">
            <Card>
              <p className="mb-3 text-sm font-semibold text-zinc-900">
                체크리스트
              </p>
              <ul className="flex flex-col gap-2">
                {s.checklist.map((item, i) => {
                  const itemKey = `${s.key}-${i}`;
                  return (
                    <li key={itemKey}>
                      <label className="flex cursor-pointer items-start gap-2 text-sm text-zinc-700">
                        <input
                          type="checkbox"
                          checked={!!checked[itemKey]}
                          onChange={() => toggleCheck(itemKey)}
                          className="mt-1"
                        />
                        <span
                          className={
                            checked[itemKey] ? "line-through text-zinc-400" : ""
                          }
                        >
                          {item}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </Card>
            <Card>
              <p className="mb-2 text-sm font-semibold text-zinc-900">
                대화 스크립트 예시
              </p>
              <p className="text-sm leading-relaxed text-zinc-700">
                {s.script}
              </p>
            </Card>
          </div>
        ))}
    </div>
  );
}
