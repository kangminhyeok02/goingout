"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import {
  COMPANY_SEARCH_CATEGORIES,
  buildSearchUrl,
} from "@/lib/companySearchLinks";

const DEFAULT_COMPANY = "삼성증권";

export function CompanySearchBoard() {
  const [company, setCompany] = useState(DEFAULT_COMPANY);
  const trimmed = company.trim() || DEFAULT_COMPANY;

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col gap-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-700">회사 이름</span>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="예: 삼성증권"
            className="rounded-lg border border-zinc-300 px-3 py-2"
          />
        </label>
        <p className="text-xs text-zinc-500">
          입력한 회사 이름으로 검색 링크가 바로 바뀌어요.
        </p>
      </Card>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {COMPANY_SEARCH_CATEGORIES.map((cat) => {
          const url = buildSearchUrl(cat.engine, cat.buildQuery(trimmed));
          return (
            <a
              key={cat.key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-1 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              <span className="font-semibold text-zinc-900">
                {cat.label} ↗
              </span>
              <span className="text-sm text-zinc-500">{cat.description}</span>
            </a>
          );
        })}
      </div>

      <p className="text-xs text-zinc-500">
        각 카드는 검색엔진(구글/네이버) 검색 결과로 연결돼요. 직접 데이터를
        수집하거나 저장하지 않으니, 실제 정보는 연결된 사이트에서 최종
        확인해주세요.
      </p>
    </div>
  );
}
