import { TOOL_GROUPS, getToolBySlug, getToolsByGroup } from "@/data/tools";
import { ToolCard } from "@/components/ui/ToolCard";
import { WelcomeModal } from "@/components/ui/WelcomeModal";
import { OpenMenuButton } from "@/components/ui/OpenMenuButton";

const FEATURED_SLUGS = [
  "severance-calculator",
  "schedule-planner",
  "resignation-email",
  "salary-negotiation",
  "post-resignation-planner",
  "lotto-numbers",
];

const totalTools = TOOL_GROUPS.reduce(
  (sum, group) => sum + getToolsByGroup(group.key).length,
  0
);

export default function Home() {
  const featuredTools = FEATURED_SLUGS.map(getToolBySlug).filter((t) => !!t);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <WelcomeModal />

      <section className="mb-10 flex flex-col items-start gap-5 sm:mb-14">
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-4xl">
          퇴사, 혼자 고민하지 마세요
        </h1>
        <p className="max-w-2xl text-zinc-600 sm:text-lg">
          결정하기부터 실행하기, 그리고 그 이후의 삶까지. 퇴사를 준비하는
          과정에서 필요한 실용적인 도구 {totalTools}가지를 모아뒀어요. 입력한
          정보는 이 브라우저에만 저장돼요.
        </p>
        <OpenMenuButton className="px-6 py-3 text-base">
          ☰ 전체 서비스 보기
        </OpenMenuButton>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold text-zinc-900 sm:text-xl">
          지금 많이 찾는 도구
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTools.map((tool) => (
            <ToolCard key={tool!.slug} tool={tool!} />
          ))}
        </div>
      </section>
    </div>
  );
}
