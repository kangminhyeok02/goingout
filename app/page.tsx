import { TOOL_GROUPS, getToolsByGroup } from "@/data/tools";
import { ToolCard } from "@/components/ui/ToolCard";
import { WelcomeModal } from "@/components/ui/WelcomeModal";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <WelcomeModal />
      <section className="mb-10 sm:mb-14">
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-4xl">
          퇴사, 혼자 고민하지 마세요
        </h1>
        <p className="mt-3 max-w-2xl text-zinc-600 sm:text-lg">
          결정하기부터 실행하기, 그리고 그 이후의 삶까지. 퇴사를 준비하는
          과정에서 필요한 실용적인 도구들을 모아뒀어요. 입력한 정보는 이
          브라우저에만 저장돼요.
        </p>
      </section>

      <div className="flex flex-col gap-10">
        {TOOL_GROUPS.map((group) => {
          const tools = getToolsByGroup(group.key);
          if (tools.length === 0) return null;
          return (
            <section key={group.key}>
              <div className="mb-4 flex items-baseline gap-2">
                <h2 className="text-lg font-bold text-zinc-900 sm:text-xl">
                  {group.label}
                </h2>
                <span className="text-sm text-zinc-500">
                  {group.description}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
