"use client";

import type { ReactNode } from "react";
import { useSidebar } from "@/components/layout/SidebarContext";
import { Button } from "@/components/ui/Button";

export function OpenMenuButton({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { toggle } = useSidebar();
  return (
    <Button onClick={toggle} className={className}>
      {children}
    </Button>
  );
}
