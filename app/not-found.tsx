import { LinkButton } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
      <span className="text-4xl">🌱</span>
      <h1 className="text-xl font-bold text-zinc-900">
        페이지를 찾을 수 없어요
      </h1>
      <p className="text-sm text-zinc-600">
        주소가 바뀌었거나 존재하지 않는 페이지예요. 허브로 돌아가서 다시
        찾아보세요.
      </p>
      <LinkButton href="/">허브로 돌아가기</LinkButton>
    </div>
  );
}
