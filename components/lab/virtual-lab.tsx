'use client'

import { useState } from 'react'
import type { SetId } from '@/lib/lab'
import { cn } from '@/lib/utils'
import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'
import { StepCoating } from './step-coating'
import { StepExtraction } from './step-extraction'
import { StepMeasurement } from './step-measurement'
import { StepNav } from './step-nav'
import { StepTesting } from './step-testing'

export function VirtualLab() {
  const [active, setActive] = useState(1)
  const [extracted, setExtracted] = useState(false)
  const [coated, setCoated] = useState<Record<SetId, boolean>>({ A: false, B: false })
  const [tested, setTested] = useState<Record<SetId, boolean[]>>({
    A: Array(5).fill(false),
    B: Array(5).fill(false),
  })
  const [graphed, setGraphed] = useState(false)

  const completed = [
    extracted,
    coated.A && coated.B,
    tested.A.every(Boolean) && tested.B.every(Boolean),
    graphed,
  ]

  function goTo(step: number) {
    setActive(step)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
        <StepNav active={active} completed={completed} onSelect={goTo} />

        <section className={cn(active !== 1 && 'hidden')} aria-label="ขั้นตอนที่ 1">
          <StepExtraction done={extracted} onComplete={() => setExtracted(true)} onNext={() => goTo(2)} />
        </section>
        {completed[0] && (
          <section className={cn(active !== 2 && 'hidden')} aria-label="ขั้นตอนที่ 2">
            <StepCoating
              done={coated}
              onSetComplete={(set) => setCoated((prev) => ({ ...prev, [set]: true }))}
              onNext={() => goTo(3)}
            />
          </section>
        )}
        {completed[1] && (
          <section className={cn(active !== 3 && 'hidden')} aria-label="ขั้นตอนที่ 3">
            <StepTesting
              tested={tested}
              onTest={(set, index) =>
                setTested((prev) => ({ ...prev, [set]: prev[set].map((v, i) => (i === index ? true : v)) }))
              }
              onNext={() => goTo(4)}
            />
          </section>
        )}
        {completed[2] && (
          <section className={cn(active !== 4 && 'hidden')} aria-label="ขั้นตอนที่ 4">
            <StepMeasurement onComplete={() => setGraphed(true)} />
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
