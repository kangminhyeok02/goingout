"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { buildSearchUrl } from "@/lib/companySearchLinks";
import data from "@/data/templates/new-job-adaptation.json";

type Section = "phase" | "relation";

export function NewJobAdaptationTips() {
  const [section, setSection] = useState<Section>("phase");
  const [phaseKey, setPhaseKey] = useState(data.phases[0].key);
  const [relationKey, setRelationKey] = useState(data.relations[0].key);

  const activePhase = data.phases.find((p) => p.key === phaseKey) ?? data.phases[0];
  const activeRelation =
    data.relations.find((r) => r.key === relationKey) ?? data.relations[0];
  const videoSearchUrl = buildSearchUrl("youtube", "신입사원 새 회사 적응 꿀팁");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setSection("phase")}
          aria-pressed={section === "phase"}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
            section === "phase"
              ? "bg-teal-600 text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          시기별 로드맵
        </button>
        <button
          type="button"
          onClick={() => setSection("relation")}
          aria-pressed={section === "relation"}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
            section === "relation"
              ? "bg-teal-600 text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          관계별 팁
        </button>
      </div>

      {section === "phase" ? (
        <>
          <div className="flex flex-wrap gap-2">
            {data.phases.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setPhaseKey(p.key)}
                aria-pressed={phaseKey === p.key}
                className={`rounded-full px-3 py-1.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
                  phaseKey === p.key
                    ? "bg-teal-600 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <Card className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-zinc-900">{activePhase.label}</p>
            <ul className="flex flex-col gap-2">
              {activePhase.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-zinc-700">
                  <span className="mt-0.5 text-teal-600">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </Card>
        </>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {data.relations.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRelationKey(r.key)}
                aria-pressed={relationKey === r.key}
                className={`rounded-full px-3 py-1.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
                  relationKey === r.key
                    ? "bg-teal-600 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <Card className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-zinc-900">{activeRelation.label}</p>
            <ul className="flex flex-col gap-2">
              {activeRelation.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-zinc-700">
                  <span className="mt-0.5 text-teal-600">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}

      <a
        href={videoSearchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col gap-1 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
      >
        <span className="font-semibold text-zinc-900">📺 새 회사 적응 참고 영상 찾아보기 ↗</span>
        <span className="text-sm text-zinc-500">
          유튜브에서 신입/이직 적응 관련 영상을 검색해서 보여드려요
        </span>
      </a>
    </div>
  );
}
