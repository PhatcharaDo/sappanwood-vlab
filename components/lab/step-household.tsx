'use client'

import { useState } from 'react'
import { CONCENTRATIONS, type SetId } from '@/lib/lab'
import { cn } from '@/lib/utils'
import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'
import { StepCoating } from './step-coating'
import { StepExtraction } from './step-extraction'
import { StepMeasurement } from './step-measurement'
import { StepNav } from './step-nav'
import { StepTesting } from './step-testing'
import { StepHousehold } from './step-household'
import { Button } from '@/components/ui/button'
import { Beaker } from 'lucide-react'

// ฟังก์ชันสร้างค่าสุ่มระยะทางกลาง (เรียงลำดับจากน้อยไปมากตามความเข้มข้น)
function generateRandomDistances() {
  const distances: number[] = []
  let current = Math.floor(Math.random() * 6) + 12
  for (let i = 0; i < CONCENTRATIONS.length; i++) {
    distances.push(current)
    current += Math.floor(Math.random() * 5) + 8
  }
  return distances
}

export function VirtualLab() {
  const [active, setActive] = useState(1)
  const [extracted, setExtracted] = useState(false)
  const [coated, setCoated] = useState<Record<SetId, boolean>>({ A: false, B: false })
  const [tested, setTested] = useState<Record<SetId, boolean[]>>({
    A: Array(5).fill(false),
    B: Array(5).fill(false),
  })
  const [graphed, setGraphed] = useState(false)
  const [showHousehold, setShowHousehold] = useState(false)

  const [randomDistances] = useState<Record<SetId, number[]>>({
    A: generateRandomDistances(),
    B: generateRandomDistances(),
  })

  const completed = [
    extracted,
    coated.A && coated.B,
    tested.A.every(Boolean) && tested.B.every(Boolean),
    graphed,
  ]

  function goTo(step: number) {
    setShowHousehold(false)
    setActive(step)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (showHousehold) {
    return (
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
          <StepHousehold onBack={() => setShowHousehold(false)} />
        </main>
        <SiteFooter />
      </div>
    )
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
              distances={randomDistances}
              onTest={(set, index) =>
                setTested((prev) => ({ ...prev, [set]: prev[set].map((v, i) => (i === index ? true : v)) }))
              }
              onNext={() => goTo(4)}
            />
          </section>
        )}
        {completed[2] && (
          <section className={cn(active !== 4 && 'hidden')} aria-label="ขั้นตอนที่ 4">
            <StepMeasurement
              distances={randomDistances}
              onComplete={() => setGraphed(true)}
            />
            {graphed && (
              <div className="mt-6 flex justify-center">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg hover:from-orange-700 hover:to-amber-700" onClick={() => setShowHousehold(true)}>
                  <Beaker className="size-5" />
                  ไปสู่การทดลองพิเศษ: สารในครัวเรือน (Household Testing)
                </Button>
              </div>
            )}
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
