퇴사 스코링 — Ralph 루프 작업 지시서 (PROMPT.md)

이 파일은 Claude Code를 반복 실행(Ralph 루프)시켜 "퇴사 스코링" 서비스를 자동으로 구현하기 위한 작업 지시서다. 매 루프 시작 시 이 파일 전체를 읽고, progress.md를 확인한 뒤, 아직 체크되지 않은 항목 중 가장 위에 있는 작업 하나만 골라 수행한다.

## 0. 루프 운영 규칙 (매번 지켜야 함)
- 이 파일(PROMPT.md)과 progress.md를 먼저 읽는다.
- progress.md에서 완료되지 않은 가장 앞선 태스크 하나만 고른다. 여러 태스크를 한 번에 처리하지 않는다.
- 해당 태스크를 구현한다.
- 구현 후 아래 "완료 기준(Definition of Done)"을 스스로 점검한다:
  - 빌드/타입체크가 통과하는가 (`npm run build` 또는 해당 스택의 동급 명령)
  - 해당 화면/기능이 브라우저에서 실제로 렌더링되는가
  - 콘솔 에러가 없는가
- 통과하면 progress.md에서 해당 항목을 [x]로 체크하고, 한 줄 요약을 추가한다.
- 통과하지 못하면 체크하지 않고, progress.md의 "이슈 로그" 섹션에 무엇이 막혔는지 기록한다.
- 한 번에 하나의 태스크만 커밋한다. 커밋 메시지는 `[task-id] 설명` 형식.
- 태스크 목록에 없는 새로운 아이디어가 떠올라도 임의로 구현하지 않는다. 대신 progress.md의 "백로그 제안" 섹션에 적어두고 다음 사람(사용자)이 검토하게 한다.
- 범위를 벗어난 리팩토링, 디자인 임의 변경, 새 라이브러리 추가는 하지 않는다. 꼭 필요하면 먼저 이슈 로그에 사유를 남기고 다음 루프에서 사용자 확인 후 진행한다.

## 1. 고정 스택 결정 (변경 금지)

Ralph는 매번 새로 판단하면 일관성이 깨지므로, 스택은 아래로 고정한다.

| 영역 | 선택 |
|---|---|
| 프레임워크 | Next.js (App Router), TypeScript |
| 스타일 | Tailwind CSS |
| 상태/저장 | 서버 없음. 모든 사용자 입력은 브라우저 로컬(useState + localStorage)만 사용 — 개인정보(금액, 연봉 등) 서버 미전송 원칙 |
| 배포 대상 | 정적 배포 가능한 형태 (Vercel 등) 지향, 백엔드 API 라우트는 3.9 전까지 사용하지 않음 |
| 라우팅 구조 | `/` 허브 화면, 서브 서비스는 `/tools/[slug]` 형태 |
| 디자인 톤 | 위로 + 실용정보. 냉소적/회사 저격 톤 금지 (카피 작성 시에도 적용) |

## 2. 디렉터리 구조 (목표)

```
app/
  page.tsx                # 메인 허브
  tools/
    boss-compatibility/    # 3.1
    survival-simulator/    # 3.2
    severance-calculator/  # 3.3
    schedule-planner/      # 3.4
    reason-phrasing/       # 3.5
    resignation-email/     # 3.6
    salary-negotiation/    # 3.7
    post-resignation-planner/ # 3.8
    company-summary/       # 3.9 (P3, 후순위)
    lotto-numbers/         # 3.10
components/
  ui/                      # 공통 컴포넌트 (카드, 버튼 등)
lib/
  calculators/             # 계산 로직 (퇴직금, 생존기간 등) — UI와 분리해서 단위 테스트 가능하게
data/
  templates/               # 화법/메일/연봉협상 정적 템플릿 JSON
progress.md                # 루프 진행 상황 (Ralph가 계속 갱신)
```

## 3. 공통 요구사항 (모든 태스크에 적용)
- 모바일 퍼스트 반응형
- 계산/진단 결과 화면에는 아래 면책 문구 중 해당하는 것을 반드시 포함:
  - 재무 관련: "참고용 시뮬레이션이며 법적 효력이 없습니다."
  - 퇴직금: "실제 지급액과 차이가 있을 수 있는 세전 금액입니다."
  - 로또: "실제 당첨을 예측하지 않는 재미 콘텐츠입니다."
- 각 서브 서비스는 허브를 거치지 않고 직접 URL로 접근해도 맥락이 이해되도록 페이지 상단에 짧은 설명 포함

## 4. 태스크 목록 (progress.md의 원본 — 최초 1회만 이 내용으로 progress.md 생성)

Ralph는 이 섹션을 progress.md로 복사해 실제 체크리스트로 사용한다. 이미 progress.md가 있으면 이 섹션은 참고만 하고 progress.md를 기준으로 작업한다.

### Phase 0 — 프로젝트 뼈대
- [ ] T0-1: Next.js + TypeScript + Tailwind 프로젝트 초기화
- [ ] T0-2: 공통 레이아웃(헤더/푸터) 및 components/ui에 카드, 버튼 컴포넌트 생성
- [ ] T0-3: 메인 허브 페이지(/)에 10개 서브 서비스 카드 정적 배치 (그룹: 결정하기 / 준비하기 / 실행하기 / 이후 삶 / 재미)

### Phase 1 — P0 (MVP 필수, 외부 데이터 의존 없음)
- [ ] T1-1: lib/calculators/severance.ts 퇴직금 계산 함수 + 단위 테스트
- [ ] T1-2: /tools/severance-calculator 화면 구현 (3.3 스펙대로: 입사일/퇴사일/급여 입력 → 결과)
- [ ] T1-3: lib/calculators/survival.ts 생존 개월수 계산 함수 + 단위 테스트
- [ ] T1-4: /tools/survival-simulator 화면 구현 (입력 폼 + 잔고 감소 라인차트)
- [ ] T1-5: data/templates/resignation-email.json 템플릿(격식/캐주얼 × 팀 전체/개별상사) 작성
- [ ] T1-6: /tools/resignation-email 화면 구현 (옵션 선택 → 실시간 미리보기 → 복사 버튼)
- [ ] T1-7: data/templates/boss-compatibility.json 질문 8~12개 + 보기 + 가중치 작성
- [ ] T1-8: /tools/boss-compatibility 화면 구현 (문항 진행 → 점수/유형 결과 카드 → 3.2로 연결 CTA)
- [ ] T1-9: /tools/lotto-numbers 화면 구현 (랜덤 6개 번호 + 멘트 + 공유용 이미지 카드)

### Phase 2 — P1 (정적 템플릿/콘텐츠 기반)
- [ ] T2-1: lib/calculators/schedule.ts 통보일 역산 로직 + 단위 테스트
- [ ] T2-2: /tools/schedule-planner 화면 구현 (입력 → 타임라인 카드 시각화)
- [ ] T2-3: data/templates/reason-phrasing.json 카테고리×관계 조합별 화법 템플릿 작성
- [ ] T2-4: /tools/reason-phrasing 화면 구현 (카드 스와이프 비교 + 복사)
- [ ] T2-5: data/templates/salary-negotiation.json 상황별 체크리스트/스크립트 콘텐츠 작성
- [ ] T2-6: /tools/salary-negotiation 화면 구현 (아코디언/탭 UI)

### Phase 3 — P2 (저장 기능 필요)
- [ ] T3-1: localStorage 기반 저장/불러오기 유틸(lib/storage.ts) 구현
- [ ] T3-2: /tools/post-resignation-planner 화면 구현 (목표 유형별 템플릿 + 커스텀 체크리스트 + 진행률 + 저장)

### Phase 4 — P3 (후순위, 외부 데이터·법적 검토 필요 — 사용자 승인 전 착수 금지)
- [ ] T4-0: [승인 대기] 외부 데이터 소스(공개 API vs 자체 콘텐츠) 결정 — 이 항목은 Ralph가 임의로 진행하지 말고 이슈 로그에 "사용자 결정 필요"로만 남길 것
- [ ] T4-1: (T4-0 승인 후) /tools/company-summary MVP: 우선 외부 검색 링크 모음 형태로 구현

### Phase 5 — 마무리
- [ ] T5-1: 전체 페이지 반응형 점검 (모바일 뷰 기준)
- [ ] T5-2: 전체 면책 문구 누락 여부 점검
- [ ] T5-3: 허브 ↔ 서브 서비스 간 CTA 연결 점검 (예: 궁합테스트 → 생존시뮬레이터)

## 5. progress.md 템플릿 (최초 생성 시 이 형태로 만들 것)

```markdown
# 진행 상황

## 완료된 태스크
(없음)

## 이슈 로그
(없음)

## 백로그 제안 (Ralph가 발견했지만 승인 전이라 보류한 아이디어)
(없음)
```
