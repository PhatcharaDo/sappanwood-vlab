'use client'

import { Check, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

export const STEPS = [
  { th: 'สกัดแก่นฝาง', en: 'Extraction' },
  { th: 'เคลือบกระดาษ µPADs', en: 'Coating - Set A & B' },
  { th: 'ทดลองหยดสาร', en: 'Testing & Capillary Action' },
  { th: 'วัดระยะทาง & กราฟ', en: 'Measurement & Graph' },
]

type StepNavProps = {
  active: number
  completed: boolean[]
  onSelect: (step: number) => void
}

export function StepNav({ active, completed, onSelect }: StepNavProps) {
  return (
    <nav aria-label="ขั้นตอนการทดลอง">
      <ol className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {STEPS.map((step, index) => {
          const number = index + 1
          const isActive = active === number
          const isDone = completed[index]
          const isLocked = index > 0 && !completed[index - 1]
          return (
            <li key={step.en}>
              <button
                type="button"
                onClick={() => onSelect(number)}
                disabled={isLocked}
                aria-current={isActive ? 'step' : undefined}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                  isActive && 'border-primary bg-primary/10',
                  !isActive && !isLocked && 'border-border bg-card hover:border-primary/60',
                  isLocked && 'cursor-not-allowed border-border/60 bg-card/50 opacity-60',
                )}
              >
                <span
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-full border-2 font-mono text-sm font-semibold',
                    isDone && 'border-success bg-success text-background',
                    !isDone && isActive && 'border-primary bg-primary text-primary-foreground',
                    !isDone && !isActive && 'border-border text-muted-foreground',
                  )}
                >
                  {isDone ? (
                    <Check className="size-4" aria-hidden="true" />
                  ) : isLocked ? (
                    <Lock className="size-4" aria-hidden="true" />
                  ) : (
                    number
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {number}. {step.th}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {step.en}
                    <span className="sr-only">
                      {isDone ? ' (เสร็จสิ้น)' : isLocked ? ' (ล็อก)' : isActive ? ' (กำลังทำ)' : ''}
                    </span>
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
