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
import { Button } from '@/components/ui/button'
import { Beaker, Unlock, Award, FileText, Mail, Phone, User, ArrowLeft, Printer } from 'lucide-react'

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
  
  // โหลดและบันทึกสถานะการทดสอบสารครัวเรือนผ่าน localStorage เพื่อไม่ให้รีเซ็ตเมื่อเข้า-ออก
  const [householdTestedMap, setHouseholdTestedMap] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('household_tested_map')
        return saved ? JSON.parse(saved) : {}
      } catch {
        return {}
      }
    }
    return {}
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('household_tested_map', JSON.stringify(householdTestedMap))
      } catch (e) {
        console.error(e)
      }
    }
  }, [householdTestedMap])

  const [showCompletion, setShowCompletion] = useState(false)
  const [isBypassed, setIsBypassed] = useState(false)

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

  // เช็คเงื่อนไขความสำเร็จแบบรัดกุม: ต้องทดสอบครบทั้ง 4 ตัวอย่างจริง ๆ เท่านั้น
  const isHouseholdFullyCompleted = 
    Boolean(householdTestedMap['vinegar']) &&
    Boolean(householdTestedMap['lime']) &&
    Boolean(householdTestedMap['baking-soda']) &&
    Boolean(householdTestedMap['soapy-water'])

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

  if (showCompletion) {
    return (
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8 md:px-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={() => setShowCompletion(false)} className="gap-2">
              <ArrowLeft className="size-4" /> กลับสู่หน้าแล็บ
            </Button>
            <h1 className="text-xl font-bold text-foreground">🎉 หน้าสรุปผลและจบหลักสูตร Virtual Lab</h1>
          </div>

          <section className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-card to-amber-500/5 p-8 text-center shadow-xl">
            <Award className="mx-auto size-16 text-amber-500 mb-3" />
            <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-400">Certificate of Completion</span>
            <h2 className="mt-4 text-2xl font-bold text-foreground">ใบประกาศนียบัตรผ่านการอบรมเชิงปฏิบัติการ</h2>
            <p className="mt-2 text-sm text-muted-foreground">ขอรับรองว่าผู้ใช้งานได้ผ่านการทดลองและปฏิบัติการเสมือนจริงสำเร็จลุล่วง</p>
            <div className="my-6 inline-block rounded-xl border border-border bg-background/50 px-6 py-3">
              <p className="text-sm font-semibold text-primary">ห้องปฏิบัติการเสมือน (Virtual Lab): µPADs สกัดแก่นฝางและการทดสอบสาร</p>
              <p className="text-xs text-muted-foreground mt-1">รางวัล DOW-CST Award ประจำปี พ.ศ. 2569</p>
            </div>
            <div>
              <Button onClick={() => window.print()} className="bg-amber-600 hover:bg-amber-700 text-white gap-2">
                <Printer className="size-4" /> พิมพ์ / บันทึกใบประกาศนียบัตร
              </Button>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="size-6 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">เอกสารใบงานการทดลอง (Worksheet & Reports)</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">ดาวน์โหลดสรุปผลการทดลอง ระยะการเคลื่อนที่ และกราฟความเข้มข้นเพื่อใช้ประกอบรายงาน</p>
            <Button variant="outline" className="gap-2">
              📄 ดาวน์โหลดไฟล์ใบงานสรุปผลการทดลอง (.PDF)
            </Button>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <User className="size-6 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">ข้อมูลผู้พัฒนาโครงการ (Developer Contacts)</h3>
            </div>
            <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
              <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-3">
                <User className="size-4 text-primary" />
                <span>ผู้พัฒนา: พชร ดวงอุปะ (James) - ม.6/2</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-3">
                <span className="text-xs font-semibold text-primary">โรงเรียน:</span>
                <span>หาดใหญ่วิทยาลัยสมบูรณ์กุลกัญญา (Hatyaiwittayalaisomboonkulkanya School)</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-3">
                <Mail className="size-4 text-primary" />
                <span>อีเมลติดต่อ: phatchara@example.com</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-3">
                <Phone className="size-4 text-primary" />
                <span>โทรศัพท์: 08x-xxx-xxxx</span>
              </div>
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    )
  }

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
            onCompleteCourse={() => setShowCompletion(true)}
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

                {/* แสดงปุ่มจบหลักสูตรเฉพาะเมื่อทำในครัวครบทั้ง 4 ตัวแล้วจริงๆ เท่านั้น */}
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
