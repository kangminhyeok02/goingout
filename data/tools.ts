export type ToolGroupKey =
  | "decide"
  | "prepare"
  | "execute"
  | "afterlife"
  | "fun";

export interface ToolGroup {
  key: ToolGroupKey;
  label: string;
  description: string;
}

export const TOOL_GROUPS: ToolGroup[] = [
  { key: "decide", label: "결정하기", description: "지금이 맞는 타이밍인지 점검해요" },
  { key: "prepare", label: "준비하기", description: "숫자와 일정을 미리 그려봐요" },
  { key: "execute", label: "실행하기", description: "통보와 대화를 준비해요" },
  { key: "afterlife", label: "이후 삶", description: "퇴사 다음 날부터를 그려봐요" },
  { key: "fun", label: "재미", description: "가볍게 쉬어가는 코너" },
];

export interface ToolMeta {
  slug: string;
  title: string;
  shortDescription: string;
  pageDescription: string;
  emoji: string;
  group: ToolGroupKey;
  comingSoon?: boolean;
}

export const TOOLS: ToolMeta[] = [
  {
    slug: "boss-compatibility",
    title: "상사 궁합 테스트",
    shortDescription: "우리 상사와 나, 얼마나 안 맞을까?",
    pageDescription:
      "몇 가지 질문에 답하면 지금 상사와의 궁합 유형을 알려드려요. 결과가 안 좋게 나와도 너무 상심하지 마세요, 재미로 보는 테스트예요.",
    emoji: "🤝",
    group: "decide",
  },
  {
    slug: "survival-simulator",
    title: "생존 시뮬레이터",
    shortDescription: "지금 퇴사하면 통장은 몇 개월을 버틸까",
    pageDescription:
      "현재 자금과 월 지출을 입력하면, 퇴사 후 통장 잔고가 어떻게 줄어드는지 그래프로 보여드려요.",
    emoji: "📉",
    group: "decide",
  },
  {
    slug: "severance-calculator",
    title: "퇴직금 계산기",
    shortDescription: "예상 퇴직금을 미리 계산해보세요",
    pageDescription:
      "입사일, 퇴사일, 월급을 입력하면 대략적인 예상 퇴직금을 계산해드려요.",
    emoji: "🧮",
    group: "prepare",
  },
  {
    slug: "schedule-planner",
    title: "퇴사 일정 플래너",
    shortDescription: "언제까지 통보해야 할지 역산해드려요",
    pageDescription:
      "희망하는 마지막 근무일을 입력하면 늦어도 언제까지 통보해야 하는지, 인수인계는 언제부터 시작하면 좋을지 타임라인으로 보여드려요.",
    emoji: "🗓️",
    group: "prepare",
  },
  {
    slug: "salary-negotiation",
    title: "연봉협상 가이드",
    shortDescription: "퇴사 카드를 쓰기 전, 협상부터",
    pageDescription:
      "상황별 체크리스트와 협상 스크립트를 모아뒀어요. 퇴사 전 마지막으로 협상을 시도해보고 싶을 때 참고하세요.",
    emoji: "💬",
    group: "prepare",
  },
  {
    slug: "reason-phrasing",
    title: "퇴사 사유 화법",
    shortDescription: "채팅으로 나에게 맞는 통보 화법 찾기",
    pageDescription:
      "챗봇과 대화하듯 상대(팀장/동료/인사팀)와 상황(이직/휴식/개인사유)을 알려주면 화법을 추천해드려요. 팀장님께 전할 땐 성함과 MBTI(재미 요소)를 입력하면 그 성향에 맞는 스타일로 다듬어드리고, 더 부드럽게·더 담백하게 다시 요청하며 계속 업그레이드할 수 있어요.",
    emoji: "🗣️",
    group: "execute",
  },
  {
    slug: "resignation-email",
    title: "퇴사 통보 메일 작성기",
    shortDescription: "격식/캐주얼 톤을 골라 바로 완성",
    pageDescription:
      "톤(격식/캐주얼)과 수신자(팀 전체/개별 상사)를 고르면 실시간으로 메일 초안을 만들어드려요. 복사해서 바로 쓰세요.",
    emoji: "✉️",
    group: "execute",
  },
  {
    slug: "post-resignation-planner",
    title: "퇴사 후 플래너",
    shortDescription: "다음 목표를 위한 체크리스트",
    pageDescription:
      "이직/휴식/창업 등 목표 유형에 맞는 템플릿 체크리스트를 고르고, 나만의 항목을 추가해 진행률을 관리하세요. 이 브라우저에 저장돼요.",
    emoji: "🧭",
    group: "afterlife",
  },
  {
    slug: "company-summary",
    title: "회사 정보 요약",
    shortDescription: "관심 있는 회사 정보, 검색 링크로 한번에",
    pageDescription:
      "회사 이름을 입력하면 공식 정보·전자공시·뉴스·재직자 리뷰·연봉·채용 공고를 검색엔진에서 바로 찾아볼 수 있는 링크를 모아드려요. 기본값은 삼성증권으로 채워져 있고, 다른 회사로 바꿔도 돼요. 직접 데이터를 수집하지 않고 검색 링크만 연결하는 방식이라, 실제 정보는 각 사이트에서 확인해주세요.",
    emoji: "🔎",
    group: "afterlife",
  },
  {
    slug: "lotto-numbers",
    title: "퇴사 기념 로또 번호",
    shortDescription: "퇴사하는 김에 인생역전도 노려보기",
    pageDescription:
      "퇴사를 기념하는 랜덤 로또 번호 6개를 뽑아드려요. 순전히 재미로 즐기는 콘텐츠입니다.",
    emoji: "🍀",
    group: "fun",
  },
  {
    slug: "corporate-jargon",
    title: "회사 은어 번역기",
    shortDescription: "그 말, 사실 이런 뜻이었어요",
    pageDescription:
      "회사에서 자주 듣는(혹은 자주 하는) 그 말들, 진짜 속뜻은 뭘까요? 가볍게 웃고 넘기는 재미 콘텐츠예요.",
    emoji: "🗨️",
    group: "fun",
  },
  {
    slug: "resignation-quotes",
    title: "퇴사 명언 카드",
    shortDescription: "떠나는 나에게 전하는 한마디",
    pageDescription:
      "퇴사를 앞두거나 막 끝낸 당신에게 어울리는 한마디를 카드로 만들어드려요. 마음에 드는 문구를 고르거나 직접 써서 이미지로 저장해보세요.",
    emoji: "🎴",
    group: "fun",
  },
];

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return TOOLS.find((tool) => tool.slug === slug);
}

export function getToolsByGroup(group: ToolGroupKey): ToolMeta[] {
  return TOOLS.filter((tool) => tool.group === group);
}
