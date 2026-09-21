import { useEffect, useState } from "react"
import { titlePuzzle } from "../data/questions"
import { evalExpression } from "../lib/runCode"
import { cn } from "../lib/cn"
import { CodeBlock } from "./CodeBlock"

interface TitleSectionProps {
  revealed: boolean
  runKey: number
  presentation: boolean
  onRun: () => void
}

const RESULT = evalExpression(titlePuzzle.code)

export function TitleSection({ revealed, runKey, presentation, onRun }: TitleSectionProps) {
  const [typed, setTyped] = useState("")

  useEffect(() => {
    if (!revealed) {
      setTyped("")
      return
    }
    setTyped("")
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setTyped(RESULT.slice(0, i))
      if (i >= RESULT.length) window.clearInterval(id)
    }, 70)
    return () => window.clearInterval(id)
  }, [revealed, runKey])

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="font-mono text-xs font-bold tracking-[0.3em] text-[var(--color-ink-faint)]">
          AN INTERACTIVE WTFJS NOTEBOOK
        </p>
        <p
          className={cn(
            "font-mono text-[var(--color-ink-soft)]",
            presentation ? "text-3xl md:text-4xl" : "text-xl md:text-2xl",
          )}
        >
          What does this code print?
        </p>
      </div>

      <CodeBlock code={titlePuzzle.code} onRun={onRun} hasRun={revealed} presentation={presentation} />

      <div
        className={cn(
          "flex min-h-[6rem] items-center justify-center rounded-2xl border-2 border-dashed transition-colors",
          presentation ? "min-h-[10rem]" : "min-h-[7rem]",
          revealed
            ? "border-[var(--color-js)] bg-[var(--color-js)]/10"
            : "border-[var(--color-card-border)] bg-[var(--color-card)]",
        )}
      >
        {revealed ? (
          <h1
            className={cn(
              "px-4 text-center font-bold tracking-tight text-[var(--color-ink)]",
              presentation ? "text-6xl md:text-8xl" : "text-4xl md:text-6xl",
            )}
          >
            {typed}
            {typed.length < RESULT.length ? <span className="term-cursor">|</span> : null}
          </h1>
        ) : (
          <p className="font-mono text-[var(--color-ink-faint)]">
            press{" "}
            <span className="rounded bg-[var(--color-ink)]/10 px-2 py-0.5 font-bold text-[var(--color-ink-soft)]">
              RUN
            </span>{" "}
            to find out
          </p>
        )}
      </div>

      {revealed && typed.length >= RESULT.length ? (
        <p
          className={cn(
            "animate-[var(--animate-fade-in)] text-center font-mono text-[var(--color-ink-soft)]",
            presentation ? "text-2xl" : "text-base",
          )}
        >
          ...you saw the title before you knew what it meant.
        </p>
      ) : null}
    </div>
  )
}
