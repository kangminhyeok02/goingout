export type DisclaimerKind = "finance" | "severance" | "lotto" | "law" | "benefit";

const DISCLAIMER_TEXT: Record<DisclaimerKind, string> = {
  finance: "참고용 시뮬레이션이며 법적 효력이 없습니다.",
  severance: "실제 지급액과 차이가 있을 수 있는 세전 금액입니다.",
  lotto: "실제 당첨을 예측하지 않는 재미 콘텐츠입니다.",
  law: "일반적인 정보 제공 목적이며 법적 조언을 대체하지 않습니다. 구체적인 사안은 고용노동부나 전문가와 상담하세요.",
  benefit: "실제 수급 여부와 금액은 고용센터 심사에 따라 달라질 수 있는 대략적인 추정치입니다.",
};

export function Disclaimer({ kinds }: { kinds: DisclaimerKind[] }) {
  if (kinds.length === 0) return null;
  return (
    <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
      {kinds.map((kind) => (
        <p key={kind}>⚠️ {DISCLAIMER_TEXT[kind]}</p>
      ))}
    </div>
  );
}
