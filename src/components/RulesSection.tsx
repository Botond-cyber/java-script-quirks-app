import { cn } from "../lib/cn"

interface RulesSectionProps {
  presentation: boolean
}

const RULES = [
  "Don't run the code yourself.",
  "Pick an answer.",
  "Commit to your guess.",
  "Then we run it.",
  "Try to figure out WHY JavaScript did that.",
]

export function RulesSection({ presentation }: RulesSectionProps) {
  return (
    <div className="flex flex-col gap-6">
      <h2
        className={cn(
          "font-bold tracking-tight text-[var(--color-ink)]",
          presentation ? "text-5xl md:text-7xl" : "text-3xl md:text-4xl",
        )}
      >
        <span className="mr-2 text-[var(--color-js-strong)]">#</span>
        Guess the JavaScript
      </h2>

      <p
        className={cn(
          "leading-relaxed text-[var(--color-ink-soft)]",
          presentation ? "text-2xl md:text-3xl" : "text-lg",
        )}
      >
        The presenter shows a piece of JavaScript. The audience guesses what it will output. Then we
        run it. Then the explanation is revealed.
      </p>

      <ol className="flex flex-col gap-3">
        {RULES.map((rule, i) => (
          <li
            key={rule}
            className={cn(
              "flex items-center gap-4 rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] px-5",
              presentation ? "py-5 text-2xl md:text-3xl" : "py-3.5 text-base md:text-lg",
            )}
          >
            <span
              className={cn(
                "flex shrink-0 items-center justify-center rounded-lg bg-[var(--color-js)] font-mono font-bold text-black",
                presentation ? "h-11 w-11 text-2xl" : "h-8 w-8 text-base",
              )}
            >
              {i + 1}
            </span>
            <span className="text-[var(--color-ink)]">{rule}</span>
          </li>
        ))}
      </ol>

      <blockquote
        className={cn(
          "rounded-xl border-l-4 border-[var(--color-js)] bg-[var(--color-js)]/10 px-6 py-5 font-mono italic text-[var(--color-ink)]",
          presentation ? "text-2xl md:text-3xl" : "text-lg",
        )}
      >
        There are no stupid guesses.
        <br />
        JavaScript is the stupid one.
      </blockquote>
    </div>
  )
}
