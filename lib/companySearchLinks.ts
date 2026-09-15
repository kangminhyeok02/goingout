export type SearchEngine = "google" | "naver" | "naver-news";

export interface CompanySearchCategory {
  key: string;
  label: string;
  description: string;
  engine: SearchEngine;
  buildQuery: (company: string) => string;
}

export const COMPANY_SEARCH_CATEGORIES: CompanySearchCategory[] = [
  {
    key: "official",
    label: "공식 정보",
    description: "공식 홈페이지, 기업 개요",
    engine: "google",
    buildQuery: (c) => `${c} 공식 홈페이지`,
  },
  {
    key: "disclosure",
    label: "전자공시(DART)",
    description: "재무제표, 사업보고서 등 공식 공시자료",
    engine: "google",
    buildQuery: (c) => `site:dart.fss.or.kr ${c}`,
  },
  {
    key: "news-naver",
    label: "최신 뉴스 (네이버)",
    description: "최근 이슈, 실적 관련 기사",
    engine: "naver-news",
    buildQuery: (c) => c,
  },
  {
    key: "news-google",
    label: "최신 뉴스 (구글)",
    description: "국내외 뉴스 폭넓게 검색",
    engine: "google",
    buildQuery: (c) => `${c} 뉴스`,
  },
  {
    key: "reviews",
    label: "재직자 리뷰",
    description: "잡플래닛, 블라인드 등 재직자 후기 검색",
    engine: "google",
    buildQuery: (c) => `${c} 잡플래닛 블라인드 리뷰`,
  },
  {
    key: "salary",
    label: "연봉 정보",
    description: "직무별 연봉 정보 검색",
    engine: "google",
    buildQuery: (c) => `${c} 연봉 정보`,
  },
  {
    key: "jobs",
    label: "채용 공고",
    description: "현재 진행 중인 채용 공고",
    engine: "google",
    buildQuery: (c) => `${c} 채용공고`,
  },
];

export function buildSearchUrl(engine: SearchEngine, query: string): string {
  const q = encodeURIComponent(query);
  switch (engine) {
    case "naver":
      return `https://search.naver.com/search.naver?query=${q}`;
    case "naver-news":
      return `https://search.naver.com/search.naver?where=news&query=${q}`;
    case "google":
    default:
      return `https://www.google.com/search?q=${q}`;
  }
}
