import { cn } from "../lib/cn"
import { ReplayIcon, HomeIcon } from "./icons"

interface FinalScreenProps {
  presentation: boolean
  score: { correct: number; answered: number }
  onReplay: () => void
  onBack: () => void
}

export function FinalScreen({ presentation, score, onReplay, onBack }: FinalScreenProps) {
  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <h1
        className={cn(
          "font-bold tracking-tight text-[var(--color-ink)]",
          presentation ? "text-6xl md:text-8xl" : "text-5xl md:text-6xl",
        )}
      >
        JavaScript is weird.
      </h1>

      <div
        className={cn(
          "max-w-2xl rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card)] px-8 py-8 leading-relaxed text-[var(--color-ink-soft)]",
          presentation ? "text-2xl md:text-3xl leading-relaxed" : "text-lg",
        )}
      >
        <p>You don&apos;t need to memorize these examples.</p>
        <p className="mt-4">The important lesson:</p>
        <p className="mt-4 font-semibold text-[var(--color-ink)]">
          JavaScript sometimes automatically converts values between types.
        </p>
        <p className="mt-4">And sometimes...</p>
        <p className="mt-1 font-mono font-bold text-[var(--color-js-strong)]">it gets weird.</p>
      </div>

      {score.answered > 0 ? (
        <div className="font-mono text-[var(--color-ink-soft)]">
          Final score:{" "}
          <span className="font-bold text-[var(--color-ink)]">
            {score.correct} / {score.answered}
          </span>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={onReplay}
          className={cn(
            "flex items-center gap-2 rounded-xl bg-[var(--color-js)] font-mono font-bold text-black transition-all hover:bg-[var(--color-js-strong)] active:scale-95",
            presentation ? "px-8 py-4 text-2xl" : "px-6 py-3 text-lg",
          )}
        >
          <ReplayIcon className={presentation ? "h-6 w-6" : "h-5 w-5"} />
          PLAY AGAIN
        </button>
        <button
          type="button"
          onClick={onBack}
          className={cn(
            "flex items-center gap-2 rounded-xl border-2 border-[var(--color-card-border)] bg-[var(--color-card)] font-mono font-bold text-[var(--color-ink)] transition-all hover:border-[var(--color-ink-soft)] active:scale-95",
            presentation ? "px-8 py-4 text-2xl" : "px-6 py-3 text-lg",
          )}
        >
          <HomeIcon className={presentation ? "h-6 w-6" : "h-5 w-5"} />
          BACK TO NOTEBOOK
        </button>
      </div>
    </div>
  )
}
