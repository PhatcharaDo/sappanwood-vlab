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
import { StepCompletion } from './step-completion'
import { Button } from '@/components/ui/button'
import { Beaker, Unlock, Award } from 'lucide-react'

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
  const [showCompletion, setShowCompletion] = useState(false)
  const [isBypassed, setIsBypassed] = useState(false)

  // เริ่มต้นเป็นวัตถุว่างเปล่าเสมอ เพื่อไม่ให้มีผลงานค้างหรือปุ่มจบหลักสูตรโผล่ขึ้นมาก่อน
  const [householdTestedMap, setHouseholdTestedMap] = useState<Record<string, boolean>>({})

  const [randomDistances] = useState<Record<SetId, number[]>>({
    A: generateRandomDistances(),
    B: generateRandomDistances(),
  })

  const completed = isBypassed
    ? [true, true, true, true]
    : [
        extracted,
        coated.A && coated.B,
        tested.A.every(Boolean) && tested.B.every(Boolean),
        graphed,
      ]

  // ตรวจสอบว่าผู้เล่นทดสอบสารในครัวเรือนครบทั้ง 4 ตัวจริงๆ แล้วหรือไม่
  const isHouseholdFullyCompleted = 
    householdTestedMap['vinegar'] === true &&
    householdTestedMap['lime'] === true &&
    householdTestedMap['baking-soda'] === true &&
    householdTestedMap['soapy-water'] === true

  function goTo(step: number) {
    setShowHousehold(false)
    setShowCompletion(false)
    setActive(step)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleBypassToggle() {
    if (!isBypassed) {
      setExtracted(true)
      setCoated({ A: true, B: true })
      setTested({ A: Array(5).fill(true), B: Array(5).fill(true) })
      setGraphed(true)
      setHouseholdTestedMap({ vinegar: true, lime: true, 'baking-soda': true, 'soapy-water': true })
    } else {
      setHouseholdTestedMap({})
    }
    setIsBypassed((prev) => !prev)
  }

  // หากอยู่ในหน้าจบหลักสูตร (เรียกใช้งานผ่านคอมโพเนนต์แยก step-completion.tsx)
  if (showCompletion) {
    return (
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />
        <StepCompletion onBack={() => setShowCompletion(false)} />
        <SiteFooter />
      </div>
    )
  }

  // หากอยู่ในหน้าทดสอบสารในครัวเรือน
  if (showHousehold) {
    return (
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
          <div className="flex justify-end">
            <Button
              variant={isBypassed ? 'default' : 'outline'}
              size="sm"
              onClick={handleBypassToggle}
              className="gap-2 border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
            >
              <Unlock className="size-4" />
              {isBypassed ? 'ปิดโหมดปลดล็อก (Bypass On)' : 'เปิดโหมดปลดล็อกทุกขั้นตอน (Bypass Off)'}
            </Button>
          </div>
          <StepHousehold
            testedMap={householdTestedMap}
            setTestedMap={setHouseholdTestedMap}
            onBack={() => setShowHousehold(false)}
          />
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {isBypassed && <span className="rounded bg-amber-500/20 px-2 py-1 font-semibold text-amber-400">⚡ กำลังเปิดโหมดปลดล็อกทุกขั้นตอน</span>}
          </div>
          <Button
            variant={isBypassed ? 'default' : 'outline'}
            size="sm"
            onClick={handleBypassToggle}
            className="gap-2 border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
          >
            <Unlock className="size-4" />
            {isBypassed ? 'ปิดโหมดปลดล็อก' : '⚡ ปลดล็อกทุกขั้นตอน'}
          </Button>
        </div>

        <StepNav active={active} completed={completed} onSelect={goTo} />

        <section className={cn(active !== 1 && 'hidden')} aria-label="ขั้นตอนที่ 1">
          <StepExtraction done={extracted} onComplete={() => setExtracted(true)} onNext={() => goTo(2)} />
        </section>
        {(completed[0] || isBypassed) && (
          <section className={cn(active !== 2 && 'hidden')} aria-label="ขั้นตอนที่ 2">
            <StepCoating
              done={coated}
              onSetComplete={(set) => setCoated((prev) => ({ ...prev, [set]: true }))}
              onNext={() => goTo(3)}
            />
          </section>
        )}
        {(completed[1] || isBypassed) && (
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
        {(completed[2] || isBypassed) && (
          <section className={cn(active !== 4 && 'hidden')} aria-label="ขั้นตอนที่ 4">
            <StepMeasurement
              distances={randomDistances}
              onComplete={() => setGraphed(true)}
            />
            {(graphed || isBypassed) && (
              <div className="mt-6 flex flex-col items-center gap-3">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg hover:from-orange-700 hover:to-amber-700" onClick={() => setShowHousehold(true)}>
                  <Beaker className="size-5" />
                  ไปสู่การทดลองพิเศษ: สารในครัวเรือน (Household Testing)
                </Button>

                {/* ปุ่มจบหลักสูตรจะแสดงขึ้นมาก็ต่อเมื่อทำในครัวครบแล้วและกดกลับมาหน้าหลักเท่านั้น */}
                {(isHouseholdFullyCompleted || isBypassed) && (
                  <Button size="lg" variant="default" className="gap-2 bg-green-600 text-white hover:bg-green-700 shadow-lg animate-bounce" onClick={() => setShowCompletion(true)}>
                    <Award className="size-5" />
                    🎓 จบหลักสูตร / ดูใบประกาศนียบัตร & ใบงาน
                  </Button>
                )}
              </div>
            )}
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
