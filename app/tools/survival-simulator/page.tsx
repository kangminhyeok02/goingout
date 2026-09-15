import type { Metadata } from "next";
import { getToolBySlug } from "@/data/tools";
import { ToolPageHeader } from "@/components/ui/ToolPageHeader";
import { SurvivalForm } from "./SurvivalForm";

const tool = getToolBySlug("survival-simulator")!;

export const metadata: Metadata = {
  title: tool.title,
  description: tool.shortDescription,
};

export default function Page() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <ToolPageHeader tool={tool} />
      <div className="mt-8">
        <SurvivalForm />
      </div>
    </div>
  );
}
