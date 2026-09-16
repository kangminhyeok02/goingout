import qna from "@/data/templates/resignation-law-qna.json";

export interface ChatAnswer {
  question: string;
  answer: string;
}

const STOPWORDS = new Set([
  "을",
  "를",
  "이",
  "가",
  "은",
  "는",
  "에",
  "에서",
  "으로",
  "로",
  "와",
  "과",
  "도",
  "의",
  "좀",
  "해요",
  "해주세요",
  "어떻게",
  "되나요",
  "있나요",
  "인가요",
  "건가요",
  "해도",
  "대해",
  "관련",
  "궁금",
  "궁금해요",
  "알려주세요",
]);

function tokenize(text: string): string[] {
  return text
    .replace(/[?!.,]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 2 && !STOPWORDS.has(w));
}

export function findAnswer(userText: string): ChatAnswer | null {
  const userTokens = new Set(tokenize(userText));
  if (userTokens.size === 0) return null;

  let best: { item: (typeof qna.items)[number]; score: number } | null = null;
  for (const item of qna.items) {
    const itemTokens = tokenize(item.q);
    let score = 0;
    for (const t of itemTokens) {
      if (userTokens.has(t)) score++;
    }
    if (!best || score > best.score) {
      best = { item, score };
    }
  }

  if (!best || best.score === 0) return null;
  return { question: best.item.q, answer: best.item.a };
}
