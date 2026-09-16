"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Disclaimer } from "@/components/ui/Disclaimer";
import data from "@/data/templates/resignation-law-qna.json";

export function ResignationLawQnA() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(i: number) {
    setOpenIndex((cur) => (cur === i ? null : i));
  }

  return (
    <div className="flex flex-col gap-6">
      <Disclaimer kinds={["law"]} />

      <div className="flex flex-col gap-3">
        {data.items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <Card key={i} className="p-0">
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                className="flex w-full items-start justify-between gap-3 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
              >
                <span className="font-semibold text-zinc-900">Q. {item.q}</span>
                <span className="mt-0.5 shrink-0 text-zinc-400">
                  {isOpen ? "▲" : "▼"}
                </span>
              </button>
              {isOpen && (
                <p className="px-5 pb-5 text-sm leading-relaxed text-zinc-700">
                  A. {item.a}
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
