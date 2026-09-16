"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TOOL_GROUPS, getToolsByGroup } from "@/data/tools";
import { useSidebar } from "@/components/layout/SidebarContext";

export function Sidebar() {
  const { open, close } = useSidebar();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  // 페이지 이동 시 드로어를 자동으로 닫아 실제 앱 내비게이션처럼 동작하게 한다.
  useEffect(() => {
    close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  function toggleGroup(key: string) {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-zinc-900/50 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={close}
        aria-hidden="true"
      />

      <nav
        aria-label="전체 서비스 메뉴"
        className={`fixed inset-y-0 left-0 z-50 flex w-[300px] max-w-[85vw] flex-col bg-white shadow-xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
          <Link href="/" className="flex items-center gap-2" onClick={close}>
            <span className="text-xl">🌱</span>
            <span className="text-base font-bold text-zinc-900">슬기로운 퇴사생활</span>
          </Link>
          <button
            type="button"
            onClick={close}
            aria-label="메뉴 닫기"
            className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          {TOOL_GROUPS.map((group) => {
            const tools = getToolsByGroup(group.key);
            if (tools.length === 0) return null;
            const isCollapsed = collapsed[group.key];
            return (
              <div key={group.key} className="mb-2">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.key)}
                  aria-expanded={!isCollapsed}
                  className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                >
                  <span>
                    <span className="text-sm font-semibold text-zinc-900">
                      {group.label}
                    </span>
                    <span className="ml-2 text-xs text-zinc-400">
                      {tools.length}개
                    </span>
                  </span>
                  <span className="text-xs text-zinc-400">
                    {isCollapsed ? "▶" : "▼"}
                  </span>
                </button>

                {!isCollapsed && (
                  <ul className="flex flex-col gap-0.5 pb-2">
                    {tools.map((tool) => {
                      const href = `/tools/${tool.slug}`;
                      const isActive = pathname === href;
                      return (
                        <li key={tool.slug}>
                          <Link
                            href={href}
                            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                              isActive
                                ? "bg-teal-50 font-semibold text-teal-700"
                                : "text-zinc-600 hover:bg-zinc-100"
                            }`}
                          >
                            <span>{tool.emoji}</span>
                            <span>{tool.title}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    </>
  );
}
