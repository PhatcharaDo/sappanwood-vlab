'use client'

import { useState, useEffect } from 'react'
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
import { Beaker, Award, Unlock } from 'lucide-react'

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
  // โหลดขั้นตอนหลัก (1-4) จาก sessionStorage
  const [active, setActive] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('lab_active_step')
      return saved ? Number(saved) : 1
    }
    return 1
  })

  // โหลดหน้าปัจจุบัน (lab / household / completion) จาก sessionStorage
  const [currentView, setCurrentView] = useState<'lab' | 'household' | 'completion'>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('lab_current_view')
      if (saved === 'household' || saved === 'completion' || saved === 'lab') return saved
    }
    return 'lab'
  })

  // Dev Bypass Flag
  const [devBypass] = useState<boolean>(true)

  const [extracted, setExtracted] = useState<boolean>(() => {
    if (typeof window !== 'undefined') return sessionStorage.getItem('lab_extracted') === 'true'
    return true
  })

  const [coated, setCoated] = useState<Record<SetId, boolean>>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('lab_coated')
      if (saved) return JSON.parse(saved)
    }
    return { A: true, B: true }
  })

  const [tested, setTested] = useState<Record<SetId, boolean[]>>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('lab_tested')
      if (saved) return JSON.parse(saved)
    }
    return { A: Array(5).fill(true), B: Array(5).fill(true) }
  })

  const [graphed, setGraphed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') return sessionStorage.getItem('lab_graphed') === 'true'
    return true
  })

  const [householdTestedMap, setHouseholdTestedMap] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('lab_household_tested')
        if (saved) return JSON.parse(saved)
      } catch (e) {
        // ignore
      }
    }
    return { vinegar: true, lime: true, 'baking-soda': true, 'soapy-water': true }
  })

  const [randomDistances] = useState<Record<SetId, number[]>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('lab_random_distances')
        if (saved) return JSON.parse(saved)
      } catch (e) {
        // ignore
      }
    }
    return { A: [12, 20, 28, 35, 42], B: [14, 22, 29, 36, 45] }
  })

  // บันทึกค่าลง sessionStorage สม่ำเสมอเพื่อรองรับการกด Refresh (รีเฟรชแล้วอยู่หน้าเดิมพร้อมข้อมูลเดิม)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('lab_active_step', String(active))
      sessionStorage.setItem('lab_current_view', currentView)
      sessionStorage.setItem('lab_extracted', String(extracted))
      sessionStorage.setItem('lab_coated', JSON.stringify(coated))
      sessionStorage.setItem('lab_tested', JSON.stringify(tested))
      sessionStorage.setItem('lab_graphed', String(graphed))
      sessionStorage.setItem('lab_household_tested', JSON.stringify(householdTestedMap))
    }
  }, [active, currentView, extracted, coated, tested, graphed, householdTestedMap])

  // จัดการการกดย้อนกลับ / ถอยหลัง ของบราวเซอร์ (Browser Back / Forward)
  useEffect(() => {
    function handlePopState(event: PopStateEvent) {
      if (event.state) {
        if (event.state.view) setCurrentView(event.state.view)
        if (event.state.step) setActive(event.state.step)
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  function changeView(view: 'lab' | 'household' | 'completion', targetStep = active) {
    setCurrentView(view)
    setActive(targetStep)
    if (typeof window !== 'undefined') {
      window.history.pushState({ view, step: targetStep }, '')
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goTo(step: number) {
    setActive(step)
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'lab', step }, '')
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const completed = [
    devBypass || extracted,
    devBypass || (coated.A && coated.B),
    devBypass || (tested.A.every(Boolean) && tested.B.every(Boolean)),
    devBypass || graphed,
  ]

  if (currentView === 'completion') {
    return (
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />
        <StepCompletion onBack={() => changeView('lab', 4)} />
        <SiteFooter />
      </div>
    )
  }

  if (currentView === 'household') {
    return (
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
          <StepHousehold
            testedMap={householdTestedMap}
            setTestedMap={setHouseholdTestedMap}
            onBack={() => changeView('lab', 4)}
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
        {/* แถบแจ้งเตือน Dev Mode Bypass */}
        <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400">
            <Unlock className="size-4" />
            โหมดทดสอบผู้พัฒนา (Developer Mode): ปลดล็อกทุกขั้นตอนแล้ว
          </div>
          <Button size="sm" variant="outline" onClick={() => changeView('completion')} className="gap-2 border-amber-500/40 text-amber-600 hover:bg-amber-500/10">
            <Award className="size-4" /> ข้ามไปหน้าประกาศนียบัตร
          </Button>
        </div>

        <StepNav active={active} completed={completed} onSelect={goTo} />

        <section className={cn(active !== 1 && 'hidden')} aria-label="ขั้นตอนที่ 1">
          <StepExtraction done={extracted} onComplete={() => setExtracted(true)} onNext={() => goTo(2)} />
        </section>

        <section className={cn(active !== 2 && 'hidden')} aria-label="ขั้นตอนที่ 2">
          <StepCoating
            done={coated}
            onSetComplete={(set) => setCoated((prev) => ({ ...prev, [set]: true }))}
            onNext={() => goTo(3)}
          />
        </section>

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

        <section className={cn(active !== 4 && 'hidden')} aria-label="ขั้นตอนที่ 4">
          <StepMeasurement
            distances={randomDistances}
            onComplete={() => setGraphed(true)}
          />
          <div className="mt-6 flex flex-col items-center gap-3">
            <Button size="lg" className="gap-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg hover:from-orange-700 hover:to-amber-700" onClick={() => changeView('household')}>
              <Beaker className="size-5" />
              ไปสู่การทดลองพิเศษ: สารในครัวเรือน (Household Testing)
            </Button>

            <Button size="lg" variant="default" className="gap-2 bg-green-600 text-white hover:bg-green-700 shadow-lg" onClick={() => changeView('completion')}>
              <Award className="size-5" />
              🎓 จบหลักสูตร / ดูใบประกาศนียบัตร & ใบงาน
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
