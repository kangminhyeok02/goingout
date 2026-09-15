# 진행 상황

## 태스크 체크리스트

### Phase 0 — 프로젝트 뼈대
- [x] T0-1: Next.js + TypeScript + Tailwind 프로젝트 초기화
- [x] T0-2: 공통 레이아웃(헤더/푸터) 및 components/ui에 카드, 버튼 컴포넌트 생성
- [x] T0-3: 메인 허브 페이지(/)에 10개 서브 서비스 카드 정적 배치 (그룹: 결정하기 / 준비하기 / 실행하기 / 이후 삶 / 재미)

### Phase 1 — P0 (MVP 필수, 외부 데이터 의존 없음)
- [x] T1-1: lib/calculators/severance.ts 퇴직금 계산 함수 + 단위 테스트
- [x] T1-2: /tools/severance-calculator 화면 구현 (3.3 스펙대로: 입사일/퇴사일/급여 입력 → 결과)
- [x] T1-3: lib/calculators/survival.ts 생존 개월수 계산 함수 + 단위 테스트
- [x] T1-4: /tools/survival-simulator 화면 구현 (입력 폼 + 잔고 감소 라인차트)
- [x] T1-5: data/templates/resignation-email.json 템플릿(격식/캐주얼 × 팀 전체/개별상사) 작성
- [x] T1-6: /tools/resignation-email 화면 구현 (옵션 선택 → 실시간 미리보기 → 복사 버튼)
- [x] T1-7: data/templates/boss-compatibility.json 질문 8~12개 + 보기 + 가중치 작성
- [x] T1-8: /tools/boss-compatibility 화면 구현 (문항 진행 → 점수/유형 결과 카드 → 3.2로 연결 CTA)
- [x] T1-9: /tools/lotto-numbers 화면 구현 (랜덤 6개 번호 + 멘트 + 공유용 이미지 카드)

### Phase 2 — P1 (정적 템플릿/콘텐츠 기반)
- [x] T2-1: lib/calculators/schedule.ts 통보일 역산 로직 + 단위 테스트
- [x] T2-2: /tools/schedule-planner 화면 구현 (입력 → 타임라인 카드 시각화)
- [x] T2-3: data/templates/reason-phrasing.json 카테고리×관계 조합별 화법 템플릿 작성
- [x] T2-4: /tools/reason-phrasing 화면 구현 (카드 스와이프 비교 + 복사)
- [x] T2-5: data/templates/salary-negotiation.json 상황별 체크리스트/스크립트 콘텐츠 작성
- [x] T2-6: /tools/salary-negotiation 화면 구현 (아코디언/탭 UI)

### Phase 3 — P2 (저장 기능 필요)
- [x] T3-1: localStorage 기반 저장/불러오기 유틸(lib/storage.ts) 구현
- [x] T3-2: /tools/post-resignation-planner 화면 구현 (목표 유형별 템플릿 + 커스텀 체크리스트 + 진행률 + 저장)

### Phase 4 — P3 (후순위, 외부 데이터·법적 검토 필요 — 사용자 승인 전 착수 금지)
- [x] T4-0: 외부 데이터 소스 결정 — 사용자 확정: 자체 데이터 수집/API 연동 없이, 구글·네이버 검색 URL로 연결하는 "검색 링크 모음" 방식으로 진행.
- [x] T4-1: /tools/company-summary MVP: 외부 검색 링크 모음 형태로 구현 (기본값 삼성증권)

### Phase 5 — 마무리
- [x] T5-1: 전체 페이지 반응형 점검 (모바일 뷰 기준)
- [x] T5-2: 전체 면책 문구 누락 여부 점검
- [x] T5-3: 허브 ↔ 서브 서비스 간 CTA 연결 점검 (예: 궁합테스트 → 생존시뮬레이터)

## 완료된 태스크
- T0-1: `create-next-app`으로 Next.js 16 (App Router) + TypeScript + Tailwind CSS 프로젝트 초기화. `npm run build` 통과, dev 서버 200 확인.
- T0-2: `components/layout/Header.tsx`, `Footer.tsx`, `components/ui/Card.tsx`, `Button.tsx`(+LinkButton), `Disclaimer.tsx`, `ToolCard.tsx`, `ToolPageHeader.tsx`, `LineChart.tsx`(SVG 라인차트, 신규 라이브러리 없이 구현) 작성.
- T0-3: `data/tools.ts`에 10개 도구 메타데이터(그룹 5개: 결정하기/준비하기/실행하기/이후 삶/재미)와 `app/page.tsx` 허브 페이지 구현. company-summary는 "준비 중" 카드로 비활성 표시(T4-0 승인 전이라 실제 기능은 구현하지 않음).
- T1-1: `lib/calculators/severance.ts` — 최근 3개월 급여+상여금 기준 평균임금으로 퇴직금 계산, 1년 미만 근무 시 미지급 처리. 단위 테스트 3개 통과.
- T1-2: `/tools/severance-calculator` 폼 구현, 퇴직금/세전 면책 문구 포함.
- T1-3: `lib/calculators/survival.ts` — 자금 소진 개월수 및 월별 타임라인 계산. 단위 테스트 3개 통과.
- T1-4: `/tools/survival-simulator` 폼 + SVG 라인차트, 재무 면책 문구, 궁합테스트 CTA 포함.
- T1-5: `data/templates/resignation-email.json` — 격식/캐주얼 × 팀 전체/개별상사 4종 템플릿.
- T1-6: `/tools/resignation-email` 톤/수신자 선택 → 실시간 미리보기 → 클립보드 복사.
- T1-7: `data/templates/boss-compatibility.json` — 문항 10개, 보기 4개(0~3점), 결과 4구간.
- T1-8: `/tools/boss-compatibility` 진행형 퀴즈 → 결과 카드 → 생존 시뮬레이터 CTA.
- T1-9: `/tools/lotto-numbers` 랜덤 6개 번호 + 멘트 카드. (SSR/CSR 렌덤 불일치로 인한 hydration 오류 방지를 위해 번호 생성은 useEffect로 마운트 후에만 실행하도록 처리)
- T2-1: `lib/calculators/schedule.ts` — 통보일/인수인계 시작일 역산. 단위 테스트 3개 통과.
- T2-2: `/tools/schedule-planner` 입력 폼 → 타임라인 카드 시각화.
- T2-3: `data/templates/reason-phrasing.json` — 카테고리 4종 × 관계 3종 = 12개 화법.
- T2-4: `/tools/reason-phrasing` 모바일 가로 스와이프 카드 비교 + 개별 복사.
- T2-5: `data/templates/salary-negotiation.json` — 상황 4종별 체크리스트+스크립트.
- T2-6: `/tools/salary-negotiation` 탭 전환 + 체크리스트/스크립트 UI.
- T3-1: `lib/storage.ts` — localStorage 저장/조회/삭제 유틸(try/catch로 프라이빗 모드 등 예외 처리).
- T3-2: `/tools/post-resignation-planner` 목표 유형 3종(이직/휴식/창업) 템플릿 + 커스텀 항목 추가/삭제 + 진행률 바 + localStorage 저장.
- T5-1: 모든 페이지 `sm:` 브레이크포인트 기반 모바일 퍼스트로 작성 확인(허브 카드 그리드, 폼 단일 컬럼, reason-phrasing 스와이프 등).
- T5-2: 퇴직금 계산기(세전+재무), 생존 시뮬레이터(재무), 로또(재미) 페이지에 해당 면책 문구 배치 확인. 나머지 도구는 스펙상 해당 문구 대상이 아님.
- T5-3: 상사 궁합 테스트 결과 카드 → 생존 시뮬레이터 CTA, 생존 시뮬레이터 결과 → 궁합 테스트 CTA 상호 연결 확인.

`npm run build`와 `npm test`(node --test) 모두 통과. dev 서버로 전체 10개 라우트(허브 + 9개 도구) 200 응답 및 서버 로그 무오류 확인.

## 이슈 로그
- Git이 이 머신에 설치되어 있지 않아(PATH에 없음) 태스크별 커밋을 수행하지 못했습니다. 사용자 확인: git 없이 진행하기로 함.
- 디렉터리명이 한글("퇴사 스코링")이라 `create-next-app`이 패키지명 검증에 실패, 임시 폴더에 생성 후 루트로 이동하는 방식으로 우회함.

## 백로그 제안 (Ralph가 발견했지만 승인 전이라 보류한 아이디어)
- 퇴사 통보 메일/화법 문구에 다국어(영어) 버전을 추가하면 좋을 것 같다는 아이디어가 있었지만 범위를 벗어나 보류합니다.

## 업그레이드 이력 (사용자 요청, 2차)
- `lib/lottoImage.ts`: Canvas 2D API(신규 라이브러리 없이)로 로또 결과 카드를 PNG로 그려 다운로드하는 기능 추가. `/tools/lotto-numbers`에 "이미지로 저장하기" 버튼 연결.
- 접근성/디테일: 모든 버튼·링크·카드에 `focus-visible` 링 스타일 추가, 토글형 버튼 그룹(톤/수신자/카테고리/상황/목표유형)에 `aria-pressed` 부여.
- `app/icon.tsx`(ImageResponse로 🌱 파비콘 생성, 기본 favicon.ico 제거), `openGraph` 메타데이터, 루트 title template(`%s | 퇴사 스코링`) 추가 — 각 도구 페이지 title 중복 문구 제거.
- `app/not-found.tsx` 커스텀 404 페이지 추가.
- `/tools/post-resignation-planner`: localStorage 로딩 중 빈 화면 대신 스켈레톤 표시.
- `npm run build`, `npm run lint`, `npm test` 모두 통과 확인.

## 업그레이드 이력 (사용자 요청, 3차)
- `/tools/reason-phrasing`를 카드 비교 UI에서 **챗봇 대화형 UI**(`ReasonPhrasingChat.tsx`)로 전면 교체.
  - 대화 흐름: 상대(팀장/동료/인사팀) 선택 → (팀장인 경우만) 성함 입력 → MBTI 선택(재미 요소, 16개 버튼 그리드, 건너뛰기 가능) → 퇴사 사유 선택 → 추천 문구 + (MBTI 입력 시) 성향별 소통 팁 제공.
  - 결과 화면에서 "🌿 더 부드럽게" / "📋 더 담백하게" 칩으로 톤을 바꿔가며 문구가 새 채팅 메시지로 "업그레이드"되는 형태 구현. "🔄 다른 이유로", "↩️ 처음부터", "복사하기"도 제공.
  - `data/templates/mbti-styles.json` 신규 작성: 16개 MBTI 유형별 별명 + 소통 팁 2개씩. 톤(직접적/부드러운)은 MBTI의 T/F 축으로 자동 매핑.
  - `data/templates/reason-phrasing.json`에 `managerStyle.openers`/`closers`(direct/warm 톤별 인사말·마무리 문구, `{{name}}` 치환) 추가. 기존 `phrases`(카테고리×관계별 핵심 문장)는 그대로 재사용.
  - 동료/인사팀 상대는 기존처럼 개인화 없이 바로 문구를 보여줌(팀장님 대상만 이름·MBTI 개인화 적용, 사용자 요청 범위에 맞춤).
  - 기존 `ReasonPhrasingBoard.tsx`(카드 스와이프 비교 UI)는 삭제하고 챗봇 UI로 대체.
  - `npm run build`, `npm run lint`, `npm test` 모두 통과, dev 서버에서 새 대화 흐름 렌더링 확인.

## 업그레이드 이력 (사용자 요청, 4차)
- `/tools/company-summary` 신규 구현 (T4-0/T4-1 완료). 사용자가 "삼성증권 관련 내용으로 수정" 요청 → 회사명 입력창(기본값 "삼성증권")과 공식정보/전자공시(DART)/뉴스(네이버·구글)/재직자 리뷰/연봉/채용공고 총 7개 카테고리의 검색 링크 카드를 제공.
- `lib/companySearchLinks.ts`: 카테고리 메타데이터 + 검색어 빌더 + `buildSearchUrl()`(구글/네이버/네이버뉴스 검색 URL 생성). 실제 회사별 직접 URL(공식 홈페이지, 잡플래닛 등)을 임의로 추측해 넣지 않고, 검증 가능한 검색엔진 URL 패턴만 사용해 안전하게 구현.
- 허브 페이지의 "준비 중" 배지 제거(`data/tools.ts`에서 `comingSoon` 삭제), `pageDescription`도 실제 기능에 맞게 갱신.
- `npm run build`, `npm run lint`, `npm test` 모두 통과, dev 서버에서 렌더링 확인.

## 업그레이드 이력 (사용자 요청, 5차)
- 서비스 이름을 "퇴사 스코링"에서 "슬기로운 퇴사생활"로 변경 (사용자가 후보 중 선택).
- `app/layout.tsx`(title/openGraph), `components/layout/Header.tsx`(로고 텍스트), `components/layout/Footer.tsx`(안내 문구), `lib/lottoImage.ts`(로또 이미지 카드 하단 워터마크) 전부 새 이름으로 교체.
- 프로젝트 디렉터리명("퇴사 스코링")과 npm 패키지명(`resignation-scoring`)은 내부 식별자라 변경하지 않음.
- `npm run build` 통과, dev 서버에서 허브 페이지에 새 이름만 노출되고 이전 이름은 사라진 것 확인.

## 업그레이드 이력 (사용자 요청, 6차)
- "재미" 그룹에 도구 2개 추가 (사용자가 후보 중 선택): `/tools/corporate-jargon`(회사 은어 번역기), `/tools/resignation-quotes`(퇴사 명언 카드).
- `corporate-jargon`: `data/templates/corporate-jargon.json`(20개 문구×속뜻 쌍) + 탭해서 진짜 의미를 확인하는 카드 그리드, 키워드 검색, "오늘의 은어" 랜덤 하이라이트. 특정 회사·인물을 겨냥하지 않는 톤 유지.
- `resignation-quotes`: `data/templates/resignation-quotes.json`(문구 12개 + 테마 4종) + 로또 이미지 기능과 동일한 Canvas 방식으로 PNG 카드 저장. 직접 문구를 입력하는 커스텀 모드도 지원.
- 코드 정리: `lottoImage.ts`와 신규 `quoteCardImage.ts`에서 중복되던 `wrapText`/`downloadCanvasAsPng`를 `lib/canvasImage.ts`로 추출해 공유.
- `components/ui/Card.tsx`에 `style` prop 지원 추가(테마 그라데이션 배경에 필요).
- `npm run build`, `npm run lint`, `npm test` 모두 통과, dev 서버에서 두 라우트 렌더링 확인.
