"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { findAnswer } from "@/lib/laborConsultantChat";
import { buildSearchUrl } from "@/lib/companySearchLinks";
import persona from "@/data/templates/labor-consultant-chat.json";

interface ChatMsg {
  id: string;
  sender: "bot" | "user";
  text: string;
}

const kakaoFinderUrl = buildSearchUrl("google", "대한노무사회 노무사 찾기");

type CallPhase = "idle" | "calling" | "connected";

function formatCallTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function LaborConsultantChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>(() => [
    { id: "m-0", sender: "bot", text: persona.greeting },
  ]);
  const [input, setInput] = useState("");
  const [callPhase, setCallPhase] = useState<CallPhase>("idle");
  const [callSeconds, setCallSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  const idRef = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const connectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function nextId(): string {
    idRef.current += 1;
    return `m-${idRef.current}`;
  }

  function startCall() {
    setCallPhase("calling");
    setCallSeconds(0);
    setMuted(false);
    setSpeakerOn(false);
    connectTimeoutRef.current = setTimeout(() => {
      setCallPhase("connected");
      callIntervalRef.current = setInterval(() => {
        setCallSeconds((s) => s + 1);
      }, 1000);
    }, 1800);
  }

  function endCall() {
    if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
    if (callIntervalRef.current) clearInterval(callIntervalRef.current);
    connectTimeoutRef.current = null;
    callIntervalRef.current = null;
    setCallPhase("idle");
  }

  useEffect(() => {
    return () => {
      if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
      if (callIntervalRef.current) clearInterval(callIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (callPhase !== "idle") endCall();
        else setOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, callPhase]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { id: nextId(), sender: "user", text: trimmed }]);
    setInput("");

    const match = findAnswer(trimmed);
    const answer = match ? match.answer : persona.fallbackAnswer;
    setMessages((prev) => [...prev, { id: nextId(), sender: "bot", text: answer }]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    ask(input);
  }

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)} className="text-sm">
        {persona.avatar} {persona.personaName}와 상담하기
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-900/50 p-0 backdrop-blur-sm animate-fade-in sm:items-center sm:p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="labor-consultant-title"
        >
          <div
            className="relative flex h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl animate-modal-in sm:h-[80vh] sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {callPhase !== "idle" && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-between bg-gradient-to-b from-zinc-900 to-zinc-800 px-8 py-12 text-white animate-fade-in">
                <div className="flex flex-col items-center gap-2 pt-8">
                  <p className="text-sm text-zinc-300">
                    {callPhase === "calling" ? "연결 중..." : formatCallTime(callSeconds)}
                  </p>
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-5xl">
                    {persona.avatar}
                  </div>
                  <p className="mt-2 text-xl font-semibold">{persona.personaName}</p>
                  <p className="text-xs text-zinc-400">{persona.phoneDisplay}</p>
                </div>

                <div className="flex flex-col items-center gap-8 pb-4">
                  <div className="flex items-center gap-6">
                    <button
                      type="button"
                      onClick={() => setMuted((v) => !v)}
                      aria-pressed={muted}
                      className={`flex h-14 w-14 items-center justify-center rounded-full text-xl transition-colors ${
                        muted ? "bg-white text-zinc-900" : "bg-white/15 hover:bg-white/25"
                      }`}
                    >
                      🔇
                    </button>
                    <button
                      type="button"
                      onClick={() => setSpeakerOn((v) => !v)}
                      aria-pressed={speakerOn}
                      className={`flex h-14 w-14 items-center justify-center rounded-full text-xl transition-colors ${
                        speakerOn ? "bg-white text-zinc-900" : "bg-white/15 hover:bg-white/25"
                      }`}
                    >
                      🔊
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={endCall}
                    aria-label="통화 종료"
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-2xl shadow-lg hover:bg-red-700"
                  >
                    <span className="inline-block rotate-[135deg]">📞</span>
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
              <div>
                <p id="labor-consultant-title" className="font-semibold text-zinc-900">
                  {persona.avatar} {persona.personaName}
                </p>
                <p className="text-xs text-zinc-400">AI가 자동으로 안내하는 채팅이에요</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="닫기"
                className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-wrap gap-2 border-b border-zinc-100 px-5 py-3">
              <button
                type="button"
                onClick={startCall}
                className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 hover:bg-teal-100"
              >
                📞 전화하기
              </button>
              <a
                href={`sms:${persona.phoneNumber}`}
                className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 hover:bg-teal-100"
              >
                💬 문자하기
              </a>
              <a
                href={kakaoFinderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-200"
              >
                다른 노무사 찾기 ↗
              </a>
            </div>

            <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
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
              {messages.length <= 1 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {persona.suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => ask(q)}
                      className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex gap-2 border-t border-zinc-100 px-4 py-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="궁금한 점을 입력해보세요"
                className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
              >
                전송
              </button>
            </form>

            <div className="px-4 pb-4">
              <Disclaimer kinds={["law"]} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
