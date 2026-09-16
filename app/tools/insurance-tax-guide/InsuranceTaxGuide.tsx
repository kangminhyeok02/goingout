"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Disclaimer } from "@/components/ui/Disclaimer";
import data from "@/data/templates/insurance-tax-guide.json";

export function InsuranceTaxGuide() {
  const [activeKey, setActiveKey] = useState(data.categories[0].key);
  const activeCategory =
    data.categories.find((c) => c.key === activeKey) ?? data.categories[0];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {data.categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setActiveKey(cat.key)}
            aria-pressed={activeKey === cat.key}
            className={`rounded-full px-4 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
              activeKey === cat.key
                ? "bg-teal-600 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      <Card className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-zinc-900">
          {activeCategory.emoji} {activeCategory.label}
        </p>
        <ul className="flex flex-col gap-2">
          {activeCategory.points.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-zinc-700">
              <span className="mt-0.5 text-teal-600">•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Disclaimer kinds={["law"]} />
    </div>
  );
}
