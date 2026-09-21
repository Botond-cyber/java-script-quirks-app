import { cn } from "../lib/cn"

export function ExtraIntroSection({ presentation }: { presentation: boolean }) {
  return (
    <div className="flex flex-col gap-5">
      <span className="w-fit rounded-lg bg-[var(--color-ink)] px-3 py-1.5 font-mono text-xs font-bold tracking-[0.25em] text-[var(--color-paper)]">
        BONUS ROUND
      </span>
      <h2
        className={cn(
          "font-bold tracking-tight text-[var(--color-ink)]",
          presentation ? "text-5xl md:text-7xl" : "text-3xl md:text-4xl",
        )}
      >
        Extra Weirdness
      </h2>
      <p
        className={cn(
          "leading-relaxed text-[var(--color-ink-soft)]",
          presentation ? "text-2xl md:text-3xl" : "text-lg",
        )}
      >
        The main presentation is over — but JavaScript is never really done. Here are a couple of
        optional extras if the class is still hungry for chaos.
      </p>
    </div>
  )
}
