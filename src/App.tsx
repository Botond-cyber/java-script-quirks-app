import { useCallback, useEffect, useMemo, useState } from "react"
import { mainQuestions, extraQuestions, questions, type Question } from "./data/questions"
import { cn } from "./lib/cn"
import { TitleSection } from "./components/TitleSection"
import { IntroSection } from "./components/IntroSection"
import { RulesSection } from "./components/RulesSection"
import { ExtraIntroSection } from "./components/ExtraIntroSection"
import { QuestionCard } from "./components/QuestionCard"
import { FinalScreen } from "./components/FinalScreen"
import { ArrowLeftIcon, ArrowRightIcon, PresentIcon, GridIcon, CloseIcon } from "./components/icons"

type Section =
  | { kind: "title"; id: string; label: string }
  | { kind: "intro"; id: string; label: string }
  | { kind: "rules"; id: string; label: string }
  | { kind: "extra-intro"; id: string; label: string }
  | { kind: "final"; id: string; label: string }
  | { kind: "question"; id: string; label: string; question: Question; roundLabel: string }

function buildSections(): Section[] {
  const list: Section[] = [
    { kind: "title", id: "title", label: "Title puzzle" },
    { kind: "intro", id: "intro", label: "Intro to JavaScript" },
    { kind: "rules", id: "rules", label: "How the game works" },
  ]
  mainQuestions.forEach((q, i) => {
    list.push({
      kind: "question",
      id: q.id,
      label: q.title,
      question: q,
      roundLabel: `ROUND ${i + 1} / ${mainQuestions.length}`,
    })
  })
  list.push({ kind: "extra-intro", id: "extra-intro", label: "Extra Weirdness" })
  extraQuestions.forEach((q) => {
    list.push({ kind: "question", id: q.id, label: q.title, question: q, roundLabel: "EXTRA" })
  })
  list.push({ kind: "final", id: "final", label: "The End" })
  return list
}

function runnableId(section: Section): string | null {
  if (section.kind === "title") return "title"
  if (section.kind === "question") return section.id
  return null
}

export default function App() {
  const sections = useMemo(buildSections, [])
  const [index, setIndex] = useState(0)
  const [presentation, setPresentation] = useState(false)
  const [showOverview, setShowOverview] = useState(false)
  const [selections, setSelections] = useState<Record<string, number>>({})
  const [runKeys, setRunKeys] = useState<Record<string, number>>({})

  const current = sections[index]
  const firstQuestionIndex = sections.findIndex((s) => s.kind === "question")
  const currentQuestionNumber = useMemo(() => {
    if (current.kind === "extra-intro" || (current.kind === "question" && current.roundLabel === "EXTRA")) return null
    if (current.kind !== "question") return 0
    return sections
      .slice(0, index + 1)
      .filter((s) => s.kind === "question" && s.roundLabel !== "EXTRA").length
  }, [current, index, sections])

  const goNext = useCallback(() => {
    setShowOverview(false)
    setIndex((i) => Math.min(i + 1, sections.length - 1))
  }, [sections.length])

  const goPrev = useCallback(() => {
    setShowOverview(false)
    setIndex((i) => Math.max(i - 1, 0))
  }, [])

  const runCurrent = useCallback(() => {
    const id = runnableId(sections[index])
    if (!id) return
    setRunKeys((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))
  }, [sections, index])

  const handleSelect = useCallback(
    (id: string, choice: number) => {
      // Lock the selection once the code has been run / revealed.
      if ((runKeys[id] ?? 0) > 0) return
      setSelections((prev) => ({ ...prev, [id]: choice }))
    },
    [runKeys],
  )

  const replay = useCallback(() => {
    setSelections({})
    setRunKeys({})
    setShowOverview(false)
    setIndex(firstQuestionIndex >= 0 ? firstQuestionIndex : 0)
  }, [firstQuestionIndex])

  // Keyboard controls
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      const tag = target?.tagName
      const typing =
        tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON" || target?.isContentEditable
      if (e.isComposing) return

      if (e.key === "Escape") {
        if (showOverview) setShowOverview(false)
        else if (presentation) setPresentation(false)
        return
      }
      if (typing) return

      if (e.key === "ArrowRight") {
        e.preventDefault()
        goNext()
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        goPrev()
      } else if (e.key === " " || e.code === "Space") {
        if (showOverview) return
        e.preventDefault()
        runCurrent()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [goNext, goPrev, runCurrent, presentation, showOverview])

  // Score — only counts questions the presenter actually answered (and ran).
  const score = useMemo(() => {
    let correct = 0
    let answered = 0
    for (const q of questions) {
      const sel = selections[q.id]
      const ran = (runKeys[q.id] ?? 0) > 0
      if (sel !== undefined && ran) {
        answered += 1
        if (sel === q.correctAnswer) correct += 1
      }
    }
    return { correct, answered }
  }, [selections, runKeys])

  const questionSectionIndexes = useMemo(
    () => sections.map((s, i) => (s.kind === "question" && s.roundLabel !== "EXTRA" ? i : -1)).filter((i) => i >= 0),
    [sections],
  )

  return (
    <div className={cn("flex min-h-full flex-col", presentation && "bg-[var(--color-paper)]")}>
      <Header
        presentation={presentation}
        score={score}
        onTogglePresentation={() => setPresentation((v) => !v)}
        onToggleOverview={() => setShowOverview((v) => !v)}
      />

      <ProgressBar
        sections={sections}
        current={index}
        questionIndexes={questionSectionIndexes}
        onJump={(i) => {
          setShowOverview(false)
          setIndex(i)
        }}
      />

      <main
        className={cn(
          "mx-auto flex w-full flex-1 flex-col px-4 pb-32",
          presentation ? "max-w-6xl justify-center pt-8" : "max-w-5xl pt-8",
        )}
      >
        <div key={current.id} className="animate-[var(--animate-slide-up)]">
          {current.kind === "title" ? (
            <TitleSection
              revealed={(runKeys["title"] ?? 0) > 0}
              runKey={runKeys["title"] ?? 0}
              presentation={presentation}
              onRun={runCurrent}
            />
          ) : null}

          {current.kind === "intro" ? <IntroSection presentation={presentation} /> : null}
          {current.kind === "rules" ? <RulesSection presentation={presentation} /> : null}
          {current.kind === "extra-intro" ? <ExtraIntroSection presentation={presentation} /> : null}

          {current.kind === "question" ? (
            <QuestionCard
              question={current.question}
              roundLabel={current.roundLabel}
              selected={selections[current.id]}
              hasRun={(runKeys[current.id] ?? 0) > 0}
              runKey={runKeys[current.id] ?? 0}
              presentation={presentation}
              onSelect={(choice) => handleSelect(current.id, choice)}
              onRun={runCurrent}
            />
          ) : null}

          {current.kind === "final" ? (
            <FinalScreen
              presentation={presentation}
              score={score}
              onReplay={replay}
              onBack={() => {
                setShowOverview(false)
                setIndex(0)
              }}
            />
          ) : null}
        </div>
      </main>

      <NavBar
        index={index}
        totalSections={sections.length}
        currentQuestionNumber={currentQuestionNumber}
        questionTotal={mainQuestions.length}
        presentation={presentation}
        onPrev={goPrev}
        onNext={goNext}
      />

      {showOverview ? (
        <Overview
          sections={sections}
          current={index}
          onClose={() => setShowOverview(false)}
          onJump={(i) => {
            setShowOverview(false)
            setIndex(i)
          }}
        />
      ) : null}
    </div>
  )
}

function Header({
  presentation,
  score,
  onTogglePresentation,
  onToggleOverview,
}: {
  presentation: boolean
  score: { correct: number; answered: number }
  onTogglePresentation: () => void
  onToggleOverview: () => void
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-card-border)] bg-[var(--color-paper)]/85 backdrop-blur">
      <div
        className={cn(
          "mx-auto flex w-full items-center gap-4 px-4",
          presentation ? "max-w-6xl py-3" : "max-w-5xl py-4",
        )}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-js)] font-mono text-lg font-black text-black">
            JS
          </span>
          <div className="leading-tight">
            <h1
              className={cn(
                "font-black tracking-tight text-[var(--color-ink)]",
                presentation ? "text-lg" : "text-xl",
              )}
            >
              JAVASCRIPT IS WEIRD
            </h1>
            {!presentation ? (
              <p className="font-mono text-xs text-[var(--color-ink-faint)]">
                Interactive JavaScript WTF notebook
              </p>
            ) : null}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {!presentation && score.answered > 0 ? (
            <span className="rounded-lg border border-[var(--color-card-border)] bg-[var(--color-card)] px-3 py-1.5 font-mono text-xs font-bold text-[var(--color-ink)]">
              SCORE: {score.correct} / {score.answered}
            </span>
          ) : null}

          {!presentation ? (
            <button
              type="button"
              onClick={onToggleOverview}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--color-card-border)] bg-[var(--color-card)] px-3 py-1.5 font-mono text-xs font-semibold text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink-soft)]"
              title="Notebook overview"
            >
              <GridIcon className="h-4 w-4" />
              Overview
            </button>
          ) : null}

          <button
            type="button"
            onClick={onTogglePresentation}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition-colors",
              presentation
                ? "border border-[var(--color-card-border)] bg-[var(--color-card)] text-[var(--color-ink)] hover:border-[var(--color-ink-soft)]"
                : "bg-[var(--color-ink)] text-[var(--color-paper)] hover:bg-black",
            )}
          >
            <PresentIcon className="h-4 w-4" />
            {presentation ? "Exit (Esc)" : "Presentation Mode"}
          </button>
        </div>
      </div>
    </header>
  )
}

function ProgressBar({
  sections,
  current,
  questionIndexes,
  onJump,
}: {
  sections: Section[]
  current: number
  questionIndexes: number[]
  onJump: (i: number) => void
}) {
  const activeQuestion = sections[current].kind === "question" && (sections[current] as { roundLabel: string }).roundLabel !== "EXTRA"
  const roundLabel = activeQuestion
    ? (sections[current] as { roundLabel: string }).roundLabel
    : sections[current].label

  return (
    <div className="border-b border-[var(--color-card-border)] bg-[var(--color-paper)]/70">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-4 px-4 py-2.5">
        <span className="font-mono text-xs font-bold tracking-[0.2em] text-[var(--color-ink-soft)]">
          {roundLabel.toUpperCase()}
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          {questionIndexes.map((qi) => {
            const state = qi === current ? "active" : qi < current ? "done" : "todo"
            return (
              <button
                key={qi}
                type="button"
                onClick={() => onJump(qi)}
                aria-label={`Go to ${sections[qi].label}`}
                className={cn(
                  "h-2.5 rounded-full transition-all",
                  state === "active" && "w-6 bg-[var(--color-js-strong)]",
                  state === "done" && "w-2.5 bg-[var(--color-ink-soft)]",
                  state === "todo" && "w-2.5 bg-[var(--color-card-border)] hover:bg-[var(--color-ink-faint)]",
                )}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

function NavBar({
  index,
  totalSections,
  currentQuestionNumber,
  questionTotal,
  presentation,
  onPrev,
  onNext,
}: {
  index: number
  totalSections: number
  currentQuestionNumber: number | null
  questionTotal: number
  presentation: boolean
  onPrev: () => void
  onNext: () => void
}) {
  const maxIndex = totalSections - 1
  const displayQuestionNumber = currentQuestionNumber === null ? "EXTRA" : `${currentQuestionNumber || 1} / ${questionTotal}`

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30">
      <div
        className={cn(
          "mx-auto flex w-full items-center justify-between gap-3 px-4 pb-5",
          presentation ? "max-w-6xl" : "max-w-5xl",
        )}
      >
        <button
          type="button"
          onClick={onPrev}
          disabled={index === 0}
          className={cn(
            "pointer-events-auto flex items-center gap-2 rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)]/95 font-mono font-semibold text-[var(--color-ink)] shadow-lg backdrop-blur transition-all hover:border-[var(--color-ink-soft)] disabled:cursor-not-allowed disabled:opacity-40",
            presentation ? "px-6 py-3 text-lg" : "px-4 py-2.5 text-sm",
          )}
        >
          <ArrowLeftIcon className={presentation ? "h-5 w-5" : "h-4 w-4"} />
          Prev
        </button>

        <span className="pointer-events-auto rounded-full bg-[var(--color-ink)]/80 px-3 py-1 font-mono text-xs font-bold text-[var(--color-paper)] backdrop-blur">
          {displayQuestionNumber}
        </span>

        <button
          type="button"
          onClick={onNext}
          disabled={index === maxIndex}
          className={cn(
            "pointer-events-auto flex items-center gap-2 rounded-xl bg-[var(--color-ink)] font-mono font-semibold text-[var(--color-paper)] shadow-lg transition-all hover:bg-black disabled:cursor-not-allowed disabled:opacity-40",
            presentation ? "px-6 py-3 text-lg" : "px-4 py-2.5 text-sm",
          )}
        >
          Next
          <ArrowRightIcon className={presentation ? "h-5 w-5" : "h-4 w-4"} />
        </button>
      </div>
    </div>
  )
}

function Overview({
  sections,
  current,
  onClose,
  onJump,
}: {
  sections: Section[]
  current: number
  onClose: () => void
  onJump: (i: number) => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="mt-16 max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-paper)] p-2 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="font-mono text-sm font-bold tracking-widest text-[var(--color-ink-soft)]">
            NOTEBOOK OVERVIEW
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--color-ink-soft)] transition-colors hover:bg-black/5"
            aria-label="Close overview"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        <ul className="flex flex-col gap-1 px-2 pb-2">
          {sections.map((s, i) => {
            const label =
              s.kind === "question"
                ? `${(s as { roundLabel: string }).roundLabel} · ${s.label}`
                : s.label
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => onJump(i)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left font-mono text-sm transition-colors",
                    i === current
                      ? "bg-[var(--color-js)]/20 font-bold text-[var(--color-ink)]"
                      : "text-[var(--color-ink-soft)] hover:bg-black/5",
                  )}
                >
                  <span className="w-6 shrink-0 text-[var(--color-ink-faint)]">{i + 1}</span>
                  <span className="truncate">{label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
