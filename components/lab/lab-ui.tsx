import { Check, CircleCheck, Info, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function StepHeading({ step, title, subtitle }: { step: number; title: string; subtitle: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="font-mono text-xs font-medium uppercase tracking-widest text-primary">Step {step}</p>
      <h2 className="text-balance text-xl font-semibold text-foreground md:text-2xl">{title}</h2>
      <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
    </div>
  )
}

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('rounded-2xl border border-border bg-card p-4 md:p-6', className)}>{children}</div>
}

export function ProcedureList({ items, current }: { items: string[]; current: number }) {
  return (
    <ol className="flex flex-col gap-2" aria-label="ขั้นตอนย่อย">
      {items.map((item, index) => {
        const done = index < current
        const active = index === current
        return (
          <li
            key={item}
            className={cn(
              'flex items-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
              active && 'bg-primary/10 text-foreground',
              done && 'text-muted-foreground',
              !done && !active && 'text-muted-foreground/70',
            )}
            aria-current={active ? 'step' : undefined}
          >
            <span
              className={cn(
                'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border font-mono text-[11px]',
                done && 'border-success bg-success text-background',
                active && 'border-primary text-primary',
                !done && !active && 'border-border',
              )}
            >
              {done ? <Check className="size-3" aria-hidden="true" /> : index + 1}
            </span>
            <span className={cn('leading-relaxed', done && 'line-through decoration-muted-foreground/40')}>{item}</span>
          </li>
        )
      })}
    </ol>
  )
}

type NoticeTone = 'info' | 'warning' | 'success'

export function Notice({ tone = 'info', children, className }: { tone?: NoticeTone; children: ReactNode; className?: string }) {
  const Icon = tone === 'warning' ? TriangleAlert : tone === 'success' ? CircleCheck : Info
  return (
    <div
      role={tone === 'warning' ? 'alert' : 'status'}
      className={cn(
        'flex items-start gap-3 rounded-xl border px-4 py-3 text-sm leading-relaxed',
        tone === 'info' && 'border-border bg-muted text-foreground',
        tone === 'warning' && 'border-destructive/50 bg-destructive/10 text-destructive',
        tone === 'success' && 'border-success/40 bg-success/10 text-success',
        className,
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0">{children}</div>
    </div>
  )
}

export function ProgressBar({ value, label }: { value: number; label: string }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100)
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="font-mono">{pct}%</span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
      >
        <div className="h-full rounded-full bg-primary transition-[width] duration-100" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
