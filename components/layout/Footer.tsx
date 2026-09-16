import { LaborConsultantChat } from "@/components/ui/LaborConsultantChat";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 text-sm text-zinc-500 sm:px-6">
        <p>
          슬기로운 퇴사생활은 참고용 정보와 시뮬레이션을 제공하는 개인용 도구입니다.
          입력한 정보는 이 브라우저에만 저장되며 서버로 전송되지 않습니다.
        </p>
        <p className="flex flex-wrap items-center gap-2">
          중요한 결정 전에는 전문가(노무사, 세무사 등)와 상담하세요.
          <LaborConsultantChat />
        </p>
      </div>
    </footer>
  );
}
