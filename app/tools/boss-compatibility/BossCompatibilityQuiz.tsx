"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button, LinkButton } from "@/components/ui/Button";
import data from "@/data/templates/boss-compatibility.json";

export function BossCompatibilityQuiz() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<number[]>([]);

  const totalQuestions = data.questions.length;
  const isFinished = step >= totalQuestions;

  function handleAnswer(score: number) {
    const next = [...scores, score];
    setScores(next);
    setStep(step + 1);
  }

  function handleRestart() {
    setStep(0);
    setScores([]);
  }

  if (isFinished) {
    const total = scores.reduce((sum, s) => sum + s, 0);
    const result = data.results.find(
      (r) => total >= r.minScore && total <= r.maxScore
    );

    return (
      <Card className="flex flex-col gap-4">
        <p className="text-sm text-zinc-500">
          총점 {total}점 / {totalQuestions * 3}점
        </p>
        <h2 className="text-xl font-bold text-teal-700">{result?.title}</h2>
        <p className="text-zinc-700">{result?.description}</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <LinkButton href="/tools/survival-simulator" className="flex-1">
            생존 시뮬레이터 해보기 →
          </LinkButton>
          <Button variant="secondary" onClick={handleRestart} className="flex-1">
            다시 테스트하기
          </Button>
        </div>
      </Card>
    );
  }

  const question = data.questions[step];

  return (
    <Card className="flex flex-col gap-5">
      <div>
        <p className="mb-1 text-sm text-zinc-500">
          {step + 1} / {totalQuestions}
        </p>
        <div className="h-1.5 w-full rounded-full bg-zinc-100">
          <div
            className="h-1.5 rounded-full bg-teal-600 transition-all"
            style={{ width: `${(step / totalQuestions) * 100}%` }}
          />
        </div>
      </div>
      <h2 className="text-lg font-semibold text-zinc-900">{question.text}</h2>
      <div className="flex flex-col gap-2">
        {question.options.map((option, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleAnswer(option.score)}
            className="rounded-xl border border-zinc-200 px-4 py-3 text-left text-sm text-zinc-700 transition-colors hover:border-teal-300 hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
          >
            {option.label}
          </button>
        ))}
      </div>
    </Card>
  );
}
