import type { Metadata } from "next";
import { getToolBySlug } from "@/data/tools";
import { ToolPageHeader } from "@/components/ui/ToolPageHeader";
import { FarewellGuide } from "./FarewellGuide";

const tool = getToolBySlug("farewell-guide")!;

export const metadata: Metadata = {
  title: tool.title,
  description: tool.shortDescription,
};

export default function Page() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <ToolPageHeader tool={tool} />
      <div className="mt-8">
        <FarewellGuide />
      </div>
    </div>
  );
}
