"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { TOOL_GROUPS, getToolsByGroup } from "@/data/tools";
import { loadFromStorage, saveToStorage } from "@/lib/storage";
import { useSidebar } from "@/components/layout/SidebarContext";

const STORAGE_KEY = "welcome-modal-seen";

export function WelcomeModal() {
  const [open, setOpen] = useState(false);
  const { toggle: toggleSidebar } = useSidebar();

  useEffect(() => {
    const seen = loadFromStorage(STORAGE_KEY, false);
    // localStorage는 마운트 이후에만 접근 가능한 외부 시스템이라 effect에서 초기값을 동기화한다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!seen) setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  function close() {
    setOpen(false);
    saveToStorage(STORAGE_KEY, true);
  }

  function closeAndOpenMenu() {
    close();
    toggleSidebar();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 p-4 backdrop-blur-sm animate-fade-in"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl animate-modal-in sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-3xl">🌱</p>
            <h2
              id="welcome-modal-title"
              className="mt-2 text-xl font-bold text-zinc-900 sm:text-2xl"
            >
              슬기로운 퇴사생활에 오신 걸 환영해요
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="닫기"
            className="shrink-0 rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            ✕
          </button>
        </div>

        <p className="mt-3 text-sm text-zinc-600 sm:text-base">
          퇴사를 고민 중이라면, <b className="text-zinc-900">결정하기</b>부터{" "}
          <b className="text-zinc-900">실행</b>, 그리고{" "}
          <b className="text-zinc-900">그 이후의 삶</b>까지 필요한 도구를 모아뒀어요.
          입력한 정보는 이 브라우저에만 저장되니 편하게 써보세요.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {TOOL_GROUPS.map((group) => {
            const tools = getToolsByGroup(group.key);
            if (tools.length === 0) return null;
            return (
              <div
                key={group.key}
                className="rounded-xl border border-zinc-200 bg-zinc-50 p-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{tools[0].emoji}</span>
                  <span className="font-semibold text-zinc-900">
                    {group.label}
                  </span>
                  <span className="ml-auto shrink-0 rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-700">
                    {tools.length}개
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-500">
                  {group.description}
                </p>
              </div>
            );
          })}
        </div>

        <Button onClick={closeAndOpenMenu} className="mt-6 w-full">
          메뉴에서 둘러보기 →
        </Button>
      </div>
    </div>
  );
}
