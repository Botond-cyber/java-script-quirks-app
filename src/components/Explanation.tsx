import { useState } from "react"
import { cn } from "../lib/cn"
import { ChevronDownIcon } from "./icons"

interface ExplanationProps {
  children: React.ReactNode
  presentation?: boolean
}

export function Explanation({ children, presentation = false }: ExplanationProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center justify-between gap-3 px-5 text-left font-mono font-semibold tracking-wide text-[var(--color-ink)] transition-colors hover:bg-black/[0.03]",
          presentation ? "py-5 text-xl md:text-2xl" : "py-4 text-sm md:text-base",
        )}
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <span className="text-[var(--color-js-strong)]">?</span>
          WHY DOES THIS HAPPEN?
        </span>
        <ChevronDownIcon
          className={cn("h-5 w-5 shrink-0 transition-transform duration-300", open && "rotate-180")}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div
            className={cn(
              "border-t border-[var(--color-card-border)] px-5 py-4 leading-relaxed text-[var(--color-ink-soft)]",
              presentation ? "text-xl md:text-2xl leading-relaxed" : "text-[15px] md:text-base",
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
