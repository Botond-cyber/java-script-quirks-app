import { useMemo, useState } from "react"
import type { Question } from "../data/questions"
import { runCode } from "../lib/runCode"
import { cn } from "../lib/cn"
import { CodeBlock } from "./CodeBlock"
import { OutputArea } from "./OutputArea"
import { Explanation } from "./Explanation"
import { CheckIcon, CloseIcon } from "./icons"

const LETTERS = ["A", "B", "C", "D", "E", "F"]

interface QuestionCardProps {
  question: Question
  roundLabel: string
  selected: number | undefined
  hasRun: boolean
  runKey: number
  presentation: boolean
  onSelect: (index: number) => void
  onRun: () => void
}

export function QuestionCard({
  question,
  roundLabel,
  selected,
  hasRun,
  runKey,
  presentation,
  onSelect,
  onRun,
}: QuestionCardProps) {
  const result = useMemo(() => runCode(question.code), [question.code])
  const [bonusRun, setBonusRun] = useState(false)
  const [bonusKey, setBonusKey] = useState(0)
  const bonusResult = useMemo(
    () => (question.bonusCode ? runCode(question.bonusCode) : null),
    [question.bonusCode],
  )

  const isCorrect = hasRun && selected !== undefined && selected === question.correctAnswer

  const titleSize = presentation ? "text-4xl md:text-6xl" : "text-2xl md:text-3xl"

  return (
    <div className="flex flex-col gap-6">
      {/* Round badge */}
      <div className="flex flex-wrap items-center gap-3">
        {question.finalBoss ? (
          <span className="animate-[var(--animate-pop)] rounded-lg bg-black px-3 py-1.5 font-mono text-sm font-bold tracking-[0.3em] text-[#ff6b6b]">
            {"\u{1F480}"} FINAL BOSS
          </span>
        ) : (
          <span className="rounded-lg bg-[var(--color-ink)] px-3 py-1.5 font-mono text-xs font-bold tracking-[0.25em] text-[var(--color-paper)]">
            {roundLabel}
          </span>
        )}
        {question.banana ? <span className="text-2xl">🍌</span> : null}
      </div>

      {/* Title + prompt */}
      <div className="flex flex-col gap-2">
        <h2 className={cn("font-bold tracking-tight text-[var(--color-ink)]", titleSize)}>
          {question.title}
        </h2>
        <p
          className={cn(
            "font-mono text-[var(--color-ink-soft)]",
            presentation ? "text-2xl md:text-3xl" : "text-base md:text-lg",
          )}
        >
          What does this output?
        </p>
        {question.note ? (
          <p
            className={cn(
              "mt-1 inline-block rounded-md bg-[var(--color-js)]/15 px-3 py-1.5 font-mono text-[var(--color-js-strong)]",
              presentation ? "text-lg md:text-xl" : "text-xs md:text-sm",
            )}
          >
            {question.note}
          </p>
        ) : null}
      </div>

      {/* Code */}
      <CodeBlock code={question.code} onRun={onRun} hasRun={hasRun} presentation={presentation} />

      {/* Choices */}
      <div className={cn("grid gap-3", presentation ? "md:grid-cols-2" : "sm:grid-cols-2")}>
        {question.choices.map((choice, i) => {
          const chosen = selected === i
          const revealCorrect = hasRun && i === question.correctAnswer
          const revealWrongPick = hasRun && chosen && i !== question.correctAnswer
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(i)}
              className={cn(
                "flex items-center gap-3 rounded-xl border-2 px-4 text-left font-mono transition-all",
                presentation ? "py-5 text-xl md:text-2xl" : "py-3.5 text-base",
                "bg-[var(--color-card)]",
                !hasRun && !chosen && "border-[var(--color-card-border)] hover:border-[var(--color-js)] hover:-translate-y-0.5",
                !hasRun && chosen && "border-[var(--color-js)] ring-2 ring-[var(--color-js)]/30",
                revealCorrect && "border-[var(--color-correct)] bg-[var(--color-correct-bg)] text-[var(--color-correct)]",
                revealWrongPick && "border-[var(--color-wrong)] bg-[var(--color-wrong-bg)] text-[var(--color-wrong)]",
                hasRun && !revealCorrect && !revealWrongPick && "border-[var(--color-card-border)] opacity-55",
              )}
              aria-pressed={chosen}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border font-bold",
                  chosen && !hasRun && "border-[var(--color-js)] bg-[var(--color-js)] text-black",
                  revealCorrect && "border-[var(--color-correct)] bg-[var(--color-correct)] text-white",
                  revealWrongPick && "border-[var(--color-wrong)] bg-[var(--color-wrong)] text-white",
                  !chosen && !hasRun && "border-[var(--color-card-border)] text-[var(--color-ink-soft)]",
                  hasRun && !revealCorrect && !revealWrongPick && "border-[var(--color-card-border)] text-[var(--color-ink-faint)]",
                )}
              >
                {revealCorrect ? <CheckIcon className="h-4 w-4" /> : LETTERS[i]}
              </span>
              <span className="break-all">{choice}</span>
            </button>
          )
        })}
      </div>

      {/* Output + verdict */}
      {hasRun ? (
        <div className="flex flex-col gap-4">
          <OutputArea codeEcho={question.code} lines={result.lines} presentation={presentation} runKey={runKey} />

          {question.banana ? <BananaBurst key={runKey} /> : null}

          {selected !== undefined ? (
            <div
              className={cn(
                "animate-[var(--animate-pop)] rounded-xl border-2 px-5 py-4 font-mono font-semibold",
                presentation ? "text-2xl md:text-3xl" : "text-base md:text-lg",
                isCorrect
                  ? "border-[var(--color-correct)] bg-[var(--color-correct-bg)] text-[var(--color-correct)]"
                  : "border-[var(--color-wrong)] bg-[var(--color-wrong-bg)] text-[var(--color-wrong)]",
              )}
            >
              {isCorrect ? (
                <span className="flex items-center gap-2">
                  <CheckIcon className="h-5 w-5 shrink-0" />
                  Correct. You understand JavaScript slightly better now.
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CloseIcon className="h-5 w-5 shrink-0" />
                  Nope. JavaScript has chosen violence.
                </span>
              )}
            </div>
          ) : null}

          {question.finalBoss ? (
            <p
              className={cn(
                "text-center font-mono font-bold tracking-wide text-[var(--color-ink)]",
                presentation ? "text-2xl md:text-3xl" : "text-lg",
              )}
            >
              You have officially encountered JavaScript.
            </p>
          ) : null}

          <Explanation presentation={presentation}>
            <p>{question.explanation}</p>
            {question.bonusCode ? (
              <div className="mt-4 flex flex-col gap-3">
                <p className="font-mono text-sm text-[var(--color-ink-faint)]">
                  Bonus — the right way to check:
                </p>
                <CodeBlock
                  code={question.bonusCode}
                  compact
                  presentation={presentation}
                  hasRun={bonusRun}
                  onRun={() => {
                    setBonusRun(true)
                    setBonusKey((k) => k + 1)
                  }}
                />
                {bonusRun && bonusResult ? (
                  <OutputArea
                    codeEcho={question.bonusCode}
                    lines={bonusResult.lines}
                    presentation={presentation}
                    runKey={bonusKey}
                  />
                ) : null}
              </div>
            ) : null}
          </Explanation>
        </div>
      ) : null}
    </div>
  )
}

function BananaBurst() {
  const bananas = Array.from({ length: 7 })
  return (
    <div className="pointer-events-none relative h-0" aria-hidden="true">
      {bananas.map((_, i) => (
        <span
          key={i}
          className="absolute text-3xl"
          style={{
            left: `${10 + i * 12}%`,
            bottom: 0,
            animation: "float-up 1.6s ease-out both",
            animationDelay: `${i * 0.08}s`,
          }}
        >
          🍌
        </span>
      ))}
    </div>
  )
}
