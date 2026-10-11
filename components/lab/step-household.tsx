'use client'

import { Beaker, CheckCircle2, Trophy, XCircle } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Notice, Panel, StepHeading } from './lab-ui'
import { cn } from '@/lib/utils'
import { mixHex } from '@/lib/lab'

const ITEMS = [
  { id: 'vinegar', name: 'น้ำส้มสายชู (Vinegar)', correctSet: 'A', desc: 'ถูกต้อง! น้ำส้มสายชูมีฤทธิ์เป็นกรด ใช้ชุด A (กระดาษแดง) เปลี่ยนเป็นสีเหลือง', distance: 15 },
  { id: 'lime', name: 'น้ำมะนาว (Lime juice)', correctSet: 'A', desc: 'ถูกต้อง! น้ำมะนาวมีฤทธิ์เป็นกรด ใช้ชุด A (กระดาษแดง) เปลี่ยนเป็นสีเหลือง-ส้ม', distance: 18 },
  { id: 'baking-soda', name: 'เบกกิ้งโซดา (Baking soda)', correctSet: 'B', desc: 'ถูกต้อง! เบกกิ้งโซดามีฤทธิ์เป็นเบส ใช้ชุด B (กระดาษเหลือง) เปลี่ยนเป็นสีแดงสด', distance: 28 },
  { id: 'soapy-water', name: 'น้ำสบู่ (Soapy water)', correctSet: 'B', desc: 'ถูกต้อง! น้ำสบู่มีฤทธิ์เป็นเบส ใช้ชุด B (กระดาษเหลือง) เปลี่ยนเป็นสีแดงสดอย่างชัดเจน', distance: 22 },
]

type Props = {
  testedMap: Record<string, boolean>
  setTestedMap: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  onBack: () => void
}

export function StepHousehold({ testedMap, setTestedMap, onBack }: Props) {
  const [samples] = useState(() => [...ITEMS])
  const [selected, setSelected] = useState(samples[0])
  const [chosenSet, setChosenSet] = useState<'A' | 'B' | null>(() => {
    return testedMap[samples[0].id] ? (samples[0].correctSet as 'A' | 'B') : null
  })

  const handleSelect = (s: typeof samples[0]) => {
    setSelected(s)
    setChosenSet(testedMap[s.id] ? (s.correctSet as 'A' | 'B') : null)
  }

  const isTested = Boolean(testedMap[selected.id])
  const activeSet = isTested ? selected.correctSet : chosenSet
  const isCorrect = activeSet === selected.correctSet
  const allDone = ITEMS.every((s) => testedMap[s.id] === true)

  const handleTestClick = () => {
    setTestedMap((prev) => ({ ...prev, [selected.id]: true }))
  }

  return (
    <div className="flex flex-col gap-6">
      <StepHeading step={5} title="ทดสอบกับสารในครัวเรือน (Real-world Household Testing)" subtitle="เลือกสารตัวอย่าง วิเคราะห์สมบัติ และเลือกชุดกระดาษ µPADs ที่เหมาะสม (ชุด A หรือ B)" />

      {allDone && (
        <Notice tone="success" className="flex items-center justify-between border-green-500/30 bg-green-500/10 p-4">
          <div className="flex items-center gap-3">
            <Trophy className="size-6 text-green-500" />
            <div>
              <p className="font-semibold text-green-400">ยอดเยี่ยมมาก! คุณทดสอบสารในครัวเรือนครบทุกรายการแล้ว</p>
              <p className="text-xs text-muted-foreground">เข้าใจหลักการทำงานของกระดาษ µPADs สกัดแก่นฝางและการประยุกต์ใช้จริง</p>
            </div>
          </div>
          {/* แสดงปุ่มกลับหน้าหลักแล็บเพียงปุ่มเดียว */}
          <Button onClick={onBack} className="bg-green-600 text-white hover:bg-green-700">
            กลับสู่หน้าหลัก Virtual Lab
          </Button>
        </Notice>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-foreground">1. เลือกสารตัวอย่างจากครัวเรือน</h3>
          <div className="grid grid-cols-1 gap-2">
            {samples.map((s) => {
              const done = Boolean(testedMap[s.id])
              return (
                <button key={s.id} type="button" onClick={() => handleSelect(s)} className={cn('flex items-center justify-between rounded-xl border p-3.5 text-left transition-colors', selected.id === s.id ? 'border-primary bg-primary/10' : 'border-border bg-card hover:border-primary/60')}>
                  <div className="flex items-center gap-2.5">
                    {done && <CheckCircle2 className="size-4 text-green-500" />}
                    <span className="font-semibold text-foreground">{s.name}</span>
                  </div>
                  {done ? <span className="rounded-full bg-green-500/20 px-2.5 py-0.5 text-[11px] font-medium text-green-400">ทดสอบแล้ว</span> : selected.id === s.id && <CheckCircle2 className="size-5 text-primary" />}
                </button>
              )
            })}
          </div>

          <h3 className="mt-2 text-sm font-semibold text-foreground">2. เลือกชุดกระดาษ µPADs สำหรับทดสอบ</h3>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" disabled={isTested} onClick={() => !isTested && setChosenSet('A')} className={cn('flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all', activeSet === 'A' ? 'border-red-500 bg-red-500/10 shadow-md' : 'border-border bg-card hover:border-red-500/50', isTested && 'cursor-not-allowed opacity-90')}>
              <div className="h-10 w-8 rounded bg-[#ff1a1a] shadow" />
              <span className="text-xs font-semibold text-foreground">ชุด A (กระดาษแดง)</span>
              {activeSet === 'A' && (selected.correctSet === 'A' ? <span className="flex items-center gap-1 text-[11px] font-bold text-green-500"><CheckCircle2 className="size-4" /> ถูกต้อง</span> : <span className="flex items-center gap-1 text-[11px] font-bold text-red-500"><XCircle className="size-4" /> ไม่ถูกต้อง</span>)}
            </button>

            <button type="button" disabled={isTested} onClick={() => !isTested && setChosenSet('B')} className={cn('flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all', activeSet === 'B' ? 'border-amber-500 bg-amber-500/10 shadow-md' : 'border-border bg-card hover:border-amber-500/50', isTested && 'cursor-not-allowed opacity-90')}>
              <div className="h-10 w-8 rounded bg-[#f2c230] shadow" />
              <span className="text-xs font-semibold text-foreground">ชุด B (กระดาษเหลือง)</span>
              {activeSet === 'B' && (selected.correctSet === 'B' ? <span className="flex items-center gap-1 text-[11px] font-bold text-green-500"><CheckCircle2 className="size-4" /> ถูกต้อง</span> : <span className="flex items-center gap-1 text-[11px] font-bold text-red-500"><XCircle className="size-4" /> ไม่ถูกต้อง</span>)}
            </button>
          </div>

          {isCorrect && !isTested && (
            <Button size="lg" onClick={handleTestClick} className="mt-2 bg-green-600 text-white hover:bg-green-700">
              <Beaker aria-hidden="true" /> หยด{selected.name} ลงบนกระดาษชุด {activeSet}
            </Button>
          )}

          {isTested && <div className="mt-2 rounded-xl bg-muted/50 p-3 text-center text-xs text-muted-foreground">✅ บันทึกผลและล็อคผลลัพธ์เรียบร้อยแล้ว</div>}
        </Panel>

        <Panel className="flex flex-col items-center justify-center gap-4 text-center">
          <h3 className="text-sm font-semibold text-foreground">ผลการทดสอบ: {selected.name}</h3>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className={cn('flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all', activeSet === 'A' ? 'border-primary bg-card shadow-lg' : 'border-border/50 bg-card/40 opacity-60')}>
              <span className="text-xs font-medium text-muted-foreground">ชุด A (กระดาษแดง)</span>
              <div className="relative flex h-64 w-32 items-end justify-center rounded-xl border border-border bg-[#0d1f38] p-4 shadow-inner">
                <div className="relative aspect-[3/4] w-24 rounded-md shadow-lg" style={{ backgroundColor: '#ff1a1a' }}>
                  <div className="absolute bottom-1 left-1/2 size-2.5 -translate-x-1/2 rounded-full border border-white/40 bg-white/10" />
                  {isTested && activeSet === 'A' && (
                    <div className="absolute inset-x-0 bottom-0 animate-migrate" style={{ height: `${selected.distance * 3}px`, background: `linear-gradient(to top, #f6b319 0%, #f6b319 88%, ${mixHex('#f6b319', '#ff1a1a', 0.5)} 100%)`, borderRadius: '2px 2px 0 0' }} />
                  )}
                </div>
              </div>
              <span className="font-mono text-[11px] text-muted-foreground">{isTested && activeSet === 'A' ? `${selected.distance} mm` : 'รอดำเนินการ'}</span>
            </div>

            <div className={cn('flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all', activeSet === 'B' ? 'border-primary bg-card shadow-lg' : 'border-border/50 bg-card/40 opacity-60')}>
              <span className="text-xs font-medium text-muted-foreground">ชุด B (กระดาษเหลือง)</span>
              <div className="relative flex h-64 w-32 items-end justify-center rounded-xl border border-border bg-[#0d1f38] p-4 shadow-inner">
                <div className="relative aspect-[3/4] w-24 rounded-md shadow-lg" style={{ backgroundColor: '#f2c230' }}>
                  <div className="absolute bottom-1 left-1/2 size-2.5 -translate-x-1/2 rounded-full border border-white/40 bg-white/10" />
                  {isTested && activeSet === 'B' && (
                    <div className="absolute inset-x-0 bottom-0 animate-migrate" style={{ height: `${selected.distance * 3}px`, background: `linear-gradient(to top, #e60000 0%, #e60000 88%, ${mixHex('#e60000', '#f2c230', 0.5)} 100%)`, borderRadius: '2px 2px 0 0' }} />
                  )}
                </div>
              </div>
              <span className="font-mono text-[11px] text-muted-foreground">{isTested && activeSet === 'B' ? `${selected.distance} mm` : 'รอดำเนินการ'}</span>
            </div>
          </div>

          {isTested && (
            <Notice tone="success" className="w-full text-left">
              <p className="flex items-center gap-1.5 font-semibold text-success-foreground"><CheckCircle2 className="size-4 text-green-500" /> สรุปผลและคำอธิบายทางเคมี:</p>
              <p className="mt-1 text-xs text-success-foreground/90">{selected.desc}</p>
            </Notice>
          )}
        </Panel>
      </div>
    </div>
  )
}
