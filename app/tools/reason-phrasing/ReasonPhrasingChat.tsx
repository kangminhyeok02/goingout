"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import data from "@/data/templates/reason-phrasing.json";
import mbtiData from "@/data/templates/mbti-styles.json";

type RelationKey = "manager" | "colleague" | "hr";
type PhraseKey = keyof typeof data.phrases;
type Tone = "direct" | "warm";
type Step = "relation" | "name" | "mbti" | "category" | "result";

interface ChatMsg {
  id: string;
  sender: "bot" | "user";
  text: string;
}

function fillName(template: string, name: string): string {
  return template.replace("{{name}}", name);
}

function toneFromMbti(type: string | null): Tone {
  if (!type) return "warm";
  return type[2] === "T" ? "direct" : "warm";
}

function buildResultText(
  relation: RelationKey,
  category: string,
  tone: Tone,
  name: string
): string {
  const core = data.phrases[`${category}_${relation}` as PhraseKey];
  if (relation !== "manager") return core;

  const opener = fillName(data.managerStyle.openers[tone], name || "팀장");
  const closer = data.managerStyle.closers[tone];
  return `${opener}\n\n${core}\n\n${closer}`;
}

const GREETING =
  "안녕하세요! 퇴사 소식을 어떻게 전하면 좋을지 같이 찾아볼게요. 먼저 누구에게 전하실 예정인가요?";

export function ReasonPhrasingChat() {
  const idRef = useRef(0);
  function nextId(): string {
    idRef.current += 1;
    return `m-${idRef.current}`;
  }

  const [messages, setMessages] = useState<ChatMsg[]>(() => [
    { id: "m-0", sender: "bot", text: GREETING },
  ]);
  const [step, setStep] = useState<Step>("relation");
  const [relation, setRelation] = useState<RelationKey | null>(null);
  const [managerName, setManagerName] = useState("");
  const [mbtiType, setMbtiType] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [tone, setTone] = useState<Tone>("warm");
  const [resultText, setResultText] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, step]);

  function addBot(text: string) {
    setMessages((prev) => [...prev, { id: nextId(), sender: "bot", text }]);
  }

  function addUser(text: string) {
    setMessages((prev) => [...prev, { id: nextId(), sender: "user", text }]);
  }

  function handleSelectRelation(key: RelationKey, label: string) {
    addUser(label);
    setRelation(key);
    if (key === "manager") {
      setStep("name");
      addBot(
        "팀장님 성함이 어떻게 되세요? 문구에 자연스럽게 녹여드릴게요. (몰라도 괜찮아요)"
      );
    } else {
      setStep("category");
      addBot("어떤 이유로 전하고 싶으세요?");
    }
  }

  function handleSubmitName(e: React.FormEvent) {
    e.preventDefault();
    const name = nameInput.trim();
    addUser(name || "(건너뛰기)");
    setManagerName(name);
    setNameInput("");
    setStep("mbti");
    addBot(
      "혹시 팀장님 MBTI를 알고 계세요? 알려주시면 그 성향에 맞는 화법으로 추천해드릴게요. (재미 요소예요, 몰라도 괜찮아요)"
    );
  }

  function handleSelectMbti(type: string | null, label: string) {
    addUser(label);
    setMbtiType(type);
    setStep("category");
    addBot("어떤 이유로 전하고 싶으세요?");
  }

  function handleSelectCategory(key: string, label: string) {
    addUser(label);
    setCategory(key);

    const initialTone = relation === "manager" ? toneFromMbti(mbtiType) : "warm";
    setTone(initialTone);

    const text = buildResultText(relation!, key, initialTone, managerName);
    setResultText(text);
    addBot(text);

    if (relation === "manager" && mbtiType) {
      const styleInfo = mbtiData.types.find((t) => t.type === mbtiType);
      if (styleInfo) {
        addBot(
          `${styleInfo.type}(${styleInfo.label}) 성향이시라면 이런 점도 참고해보세요:\n· ${styleInfo.tips.join("\n· ")}`
        );
      }
    }

    setStep("result");
  }

  function handleToneChange(newTone: Tone, chipLabel: string) {
    if (!relation || !category) return;
    if (newTone === tone) return;
    addUser(chipLabel);
    setTone(newTone);
    const text = buildResultText(relation, category, newTone, managerName);
    setResultText(text);
    addBot(`업그레이드된 버전이에요:\n\n${text}`);
  }

  function handleChangeCategory() {
    addUser("다른 이유로 다시 볼래요");
    setStep("category");
    addBot("어떤 이유로 다시 전달해볼까요?");
  }

  function handleRestart() {
    setMessages([{ id: nextId(), sender: "bot", text: GREETING }]);
    setStep("relation");
    setRelation(null);
    setManagerName("");
    setMbtiType(null);
    setCategory(null);
    setTone("warm");
    setResultText("");
    setNameInput("");
  }

  async function handleCopy() {
    if (!resultText) return;
    try {
      await navigator.clipboard.writeText(resultText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Card className="flex flex-col gap-4 p-0 overflow-hidden">
      <div className="flex max-h-[420px] flex-col gap-3 overflow-y-auto p-5">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${
                m.sender === "user"
                  ? "bg-teal-600 text-white"
                  : "bg-zinc-100 text-zinc-800"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex flex-col gap-3 border-t border-zinc-100 p-4">
        {step === "relation" && (
          <div className="flex flex-wrap gap-2">
            {data.relations.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => handleSelectRelation(r.key as RelationKey, r.label)}
                className="rounded-full bg-zinc-100 px-4 py-2 text-sm text-zinc-700 hover:bg-teal-50 hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
              >
                {r.label}
              </button>
            ))}
          </div>
        )}

        {step === "name" && (
          <form onSubmit={handleSubmitName} className="flex gap-2">
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="예: 김민준 (선택)"
              className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              전달
            </button>
          </form>
        )}

        {step === "mbti" && (
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-4 gap-1.5">
              {mbtiData.types.map((t) => (
                <button
                  key={t.type}
                  type="button"
                  onClick={() => handleSelectMbti(t.type, `${t.type} (${t.label})`)}
                  className="rounded-lg bg-zinc-100 px-2 py-1.5 text-xs font-medium text-zinc-700 hover:bg-teal-50 hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
                >
                  {t.type}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => handleSelectMbti(null, "모르겠어요")}
              className="w-fit text-xs text-zinc-500 underline hover:text-teal-700"
            >
              모르겠어요, 건너뛸게요
            </button>
          </div>
        )}

        {step === "category" && (
          <div className="flex flex-wrap gap-2">
            {data.categories.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => handleSelectCategory(c.key, c.label)}
                className="rounded-full bg-zinc-100 px-4 py-2 text-sm text-zinc-700 hover:bg-teal-50 hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
              >
                {c.label}
              </button>
            ))}
          </div>
        )}

        {step === "result" && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              {relation === "manager" && (
                <>
                  <button
                    type="button"
                    onClick={() => handleToneChange("warm", "더 부드럽게 바꿔줘")}
                    disabled={tone === "warm"}
                    className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
                  >
                    🌿 더 부드럽게
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToneChange("direct", "더 담백하게 바꿔줘")}
                    disabled={tone === "direct"}
                    className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700 hover:bg-sky-100 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
                  >
                    📋 더 담백하게
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={handleChangeCategory}
                className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
              >
                🔄 다른 이유로
              </button>
              <button
                type="button"
                onClick={handleRestart}
                className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
              >
                ↩️ 처음부터
              </button>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-lg border border-zinc-200 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              {copied ? "복사됐어요 ✓" : "최근 문구 복사하기"}
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}
