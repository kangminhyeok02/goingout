export type DisclaimerKind = "finance" | "severance" | "lotto";

const DISCLAIMER_TEXT: Record<DisclaimerKind, string> = {
  finance: "참고용 시뮬레이션이며 법적 효력이 없습니다.",
  severance: "실제 지급액과 차이가 있을 수 있는 세전 금액입니다.",
  lotto: "실제 당첨을 예측하지 않는 재미 콘텐츠입니다.",
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
