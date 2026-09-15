"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { loadFromStorage, saveToStorage } from "@/lib/storage";
import goalData from "@/data/templates/post-resignation-planner.json";

interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

interface PlannerState {
  goalType: string;
  items: ChecklistItem[];
}

const STORAGE_KEY = "post-resignation-planner";

function buildDefaultItems(goalKey: string): ChecklistItem[] {
  const goal = goalData.goalTypes.find((g) => g.key === goalKey);
  return (goal?.defaultItems ?? []).map((text, i) => ({
    id: `default-${goalKey}-${i}`,
    text,
    done: false,
  }));
}

export function PostResignationPlanner() {
  const [state, setState] = useState<PlannerState | null>(null);
  const [newItemText, setNewItemText] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const initialGoalKey = goalData.goalTypes[0].key;
    const stored = loadFromStorage<PlannerState | null>(STORAGE_KEY, null);
    // localStorage는 마운트 이후에만 접근 가능한 외부 시스템이라 effect에서 초기값을 동기화한다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(
      stored ?? { goalType: initialGoalKey, items: buildDefaultItems(initialGoalKey) }
    );
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded && state) {
      saveToStorage(STORAGE_KEY, state);
    }
  }, [state, loaded]);

  if (!state) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-6 w-24 rounded bg-zinc-200" />
        <Card className="flex flex-col gap-4">
          <div className="h-2 w-full rounded-full bg-zinc-100" />
          <div className="h-10 rounded-lg bg-zinc-100" />
          <div className="h-10 rounded-lg bg-zinc-100" />
          <div className="h-10 rounded-lg bg-zinc-100" />
        </Card>
      </div>
    );
  }

  const doneCount = state.items.filter((item) => item.done).length;
  const progress =
    state.items.length === 0 ? 0 : Math.round((doneCount / state.items.length) * 100);

  function handleGoalChange(goalKey: string) {
    setState({ goalType: goalKey, items: buildDefaultItems(goalKey) });
  }

  function toggleItem(id: string) {
    setState((prev) =>
      prev
        ? {
            ...prev,
            items: prev.items.map((item) =>
              item.id === id ? { ...item, done: !item.done } : item
            ),
          }
        : prev
    );
  }

  function removeItem(id: string) {
    setState((prev) =>
      prev ? { ...prev, items: prev.items.filter((item) => item.id !== id) } : prev
    );
  }

  function addItem(e: React.FormEvent) {
    e.preventDefault();
    if (!newItemText.trim() || !state) return;
    setState({
      ...state,
      items: [
        ...state.items,
        { id: `custom-${Date.now()}`, text: newItemText.trim(), done: false },
      ],
    });
    setNewItemText("");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-sm font-medium text-zinc-700">목표 유형</p>
        <div className="flex flex-wrap gap-2">
          {goalData.goalTypes.map((g) => (
            <button
              key={g.key}
              type="button"
              onClick={() => handleGoalChange(g.key)}
              aria-pressed={state.goalType === g.key}
              className={`rounded-full px-4 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
                state.goalType === g.key
                  ? "bg-teal-600 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-zinc-500">
          유형을 바꾸면 기본 체크리스트가 새로 채워져요.
        </p>
      </div>

      <Card className="flex flex-col gap-4">
        <div>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium text-zinc-700">진행률</span>
            <span className="text-zinc-500">
              {doneCount} / {state.items.length}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-zinc-100">
            <div
              className="h-2 rounded-full bg-teal-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <ul className="flex flex-col gap-2">
          {state.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-zinc-100 px-3 py-2"
            >
              <label className="flex flex-1 cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggleItem(item.id)}
                />
                <span className={item.done ? "text-zinc-400 line-through" : "text-zinc-700"}>
                  {item.text}
                </span>
              </label>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                aria-label="항목 삭제"
                className="text-zinc-400 hover:text-red-500"
              >
                ✕
              </button>
            </li>
          ))}
          {state.items.length === 0 && (
            <li className="py-4 text-center text-sm text-zinc-400">
              체크리스트가 비어있어요. 아래에서 항목을 추가해보세요.
            </li>
          )}
        </ul>

        <form onSubmit={addItem} className="flex gap-2">
          <input
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="나만의 체크리스트 항목 추가"
            className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
          <Button type="submit" variant="secondary">
            추가
          </Button>
        </form>
      </Card>
      <p className="text-xs text-zinc-500">
        입력한 내용은 이 브라우저에만 저장돼요. 다른 기기에서는 보이지
        않아요.
      </p>
    </div>
  );
}
