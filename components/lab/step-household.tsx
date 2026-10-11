'use client'

import { ArrowLeft, Beaker, CheckCircle2, XCircle } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Notice, Panel, StepHeading } from './lab-ui'
import { cn } from '@/lib/utils'
import { mixHex } from '@/lib/lab'

const HOUSEHOLD_SAMPLES = [
  {
    id: 'vinegar',
    name: 'น้ำส้มสายชู (Vinegar)',
    type: 'กรดอ่อน',
    correctSet: 'A',
    correctDesc: 'ถูกต้อง! น้ำส้มสายชูมีฤทธิ์เป็นกรด ต้องใช้ชุด A (กระดาษสีแดงเคลือบเบส) ซึ่งจะเปลี่ยนเป็นสีเหลืองเมื่อทำปฏิกิริยา',
    distance: 15,
  },
  {
    id: 'lime',
    name: 'น้ำมะนาว (Lime juice)',
    type: 'กรดอ่อน',
    correctSet: 'A',
    correctDesc: 'ถูกต้อง! น้ำมะนาวมีฤทธิ์เป็นกรด เหมาะกับการใช้ชุด A (กระดาษสีแดงเคลือบเบส) เพื่อสังเกตการเปลี่ยนเป็นสีเหลือง-ส้ม',
    distance: 18,
  },
  {
    id: 'baking-soda',
    name: 'เบกกิ้งโซดา (Baking soda)',
    type: 'เบสอ่อน',
    correctSet: 'B',
    correctDesc: 'ถูกต้อง! เบกกิ้งโซดามีฤทธิ์เป็นเบส ต้องใช้ชุด B (กระดาษสีเหลืองเคลือบกรด) ซึ่งจะเปลี่ยนเป็นสีแดงสดเมื่อทำปฏิกิริยา',
    distance: 28,
  },
  {
    id: 'soapy-water',
    name: 'น้ำสบู่ (Soapy water)',
    type: 'เบสอ่อน',
    correctSet: 'B',
    correctDesc: 'ถูกต้อง! น้ำสบู่มีฤทธิ์เป็นเบส ต้องใช้ชุด B (กระดาษสีเหลืองเคลือบกรด) เพื่อให้เกิดการเปลี่ยนสีเป็นสีแดงสดอย่างชัดเจน',
    distance: 22,
  },
]

type Props = {
  onBack: () => void
}

export function StepHousehold({ onBack }: Props) {
  const [selectedSample, setSelectedSample] = useState(HOUSEHOLD_SAMPLES[0])
  const [chosenSet, setChosenSet] = useState<'A' | 'B' | null>(null)
  const [tested, setTested] = useState(false)

  const setAInfo = {
    paperColor: '#ff1a1a',
    reactedColor: '#f6b319',
    title: 'ชุด A: กระดาษสีแดง (เคลือบเบส)',
  }

  const setBInfo = {
    paperColor: '#f2c230',
    reactedColor: '#e60000',
    title: 'ชุด B: กระดาษสีเหลือง (เคลือบกรด)',
  }

  const handleSelectSample = (sample: typeof HOUSEHOLD_SAMPLES[0]) => {
    setSelectedSample(sample)
    setChosenSet(null)
    setTested(false)
  }

  const isCorrect = chosenSet === selectedSample.correctSet

  return (
    <div className="flex flex-col gap-6">
      <StepHeading
        step={5}
        title="ทดสอบกับสารในครัวเรือน (Real-world Household Testing)"
        subtitle="เลือกสารตัวอย่าง เลือกชุดกระดาษ µPADs ที่เหมาะสม (ชุด A หรือ B) แล้วทำการหยดทดสอบเพื่อดูการเปลี่ยนสีและระยะการเคลื่อนที่"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-foreground">1. เลือกสารตัวอย่างจากครัวเรือน</h3>
          <div className="grid grid-cols-1 gap-2">
            {HOUSEHOLD_SAMPLES.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className={cn(
                  'flex items-center justify-between rounded-xl border p-3 text-left transition-colors',
                  selectedSample.id === sample.id ? 'border-primary bg-primary/10' : 'border-border bg-card hover:border-primary/60',
                )}
              >
                <div>
                  <span className="block font-semibold text-foreground">{sample.name}</span>
                  <span className="text-xs text-muted-foreground">ประเภท: {sample.type}</span>
                </div>
                {selectedSample.id === sample.id && <CheckCircle2 className="size-5 text-primary" />}
              </button>
            ))}
          </div>

          <h3 className="mt-2 text-sm font-semibold text-foreground">2. เลือกชุดกระดาษ µPADs สำหรับทดสอบ</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setChosenSet('A')
                setTested(false)
              }}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all',
                chosenSet === 'A' ? 'border-red-500 bg-red-500/10 shadow-md' : 'border-border bg-card hover:border-red-500/50'
              )}
            >
              <div className="h-10 w-8 rounded bg-[#ff1a1a] shadow" />
              <span className="text-xs font-semibold text-foreground">ชุด A (กระดาษแดง)</span>
              {chosenSet === 'A' && (
                selectedSample.correctSet === 'A' ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-green-500"><CheckCircle2 className="size-4" /> ถูกต้อง</span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-red-500"><XCircle className="size-4" /> ลองใหม่อีกครั้ง</span>
                )
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setChosenSet('B')
                setTested(false)
              }}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all',
                chosenSet === 'B' ? 'border-amber-500 bg-amber-500/10 shadow-md' : 'border-border bg-card hover:border-amber-500/50'
              )}
            >
              <div className="h-10 w-8 rounded bg-[#f2c230] shadow" />
              <span className="text-xs font-semibold text-foreground">ชุด B (กระดาษเหลือง)</span>
              {chosenSet === 'B' && (
                selectedSample.correctSet === 'B' ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-green-500"><CheckCircle2 className="size-4" /> ถูกต้อง</span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-red-500"><XCircle className="size-4" /> ลองใหม่อีกครั้ง</span>
                )
              )}
            </button>
          </div>

          {isCorrect && (
            <Button size="lg" onClick={() => setTested(true)} className="mt-2 bg-green-600 text-white hover:bg-green-700">
              <Beaker aria-hidden="true" />
              หยด{selectedSample.name} ลงบนกระดาษชุด {chosenSet}
            </Button>
          )}
        </Panel>

        <Panel className="flex flex-col items-center justify-center gap-4 text-center">
          <h3 className="text-sm font-semibold text-foreground">ผลการทดสอบ: {selectedSample.name}</h3>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className={cn('flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all', chosenSet === 'A' ? 'border-primary bg-card shadow-lg' : 'border-border/50 bg-card/40 opacity-60')}>
              <span className="text-xs font-medium text-muted-foreground">ชุด A (กระดาษแดง)</span>
              <div className="relative flex h-64 w-32 items-end justify-center rounded-xl border border-border bg-[#0d1f38] p-4 shadow-inner">
                <div
                  className="relative aspect-[3/4] w-24 rounded-md shadow-lg"
                  style={{ backgroundColor: setAInfo.paperColor }}
                >
                  <div className="absolute bottom-1 left-1/2 size-2.5 -translate-x-1/2 rounded-full border border-white/40 bg-white/10" />
                  {tested && chosenSet === 'A' && (
                    <div
                      className="absolute inset-x-0 bottom-0 animate-migrate"
                      style={{
                        height: `${selectedSample.distance * 3}px`,
                        background: `linear-gradient(to top, ${setAInfo.reactedColor} 0%, ${setAInfo.reactedColor} 88%, ${mixHex(setAInfo.reactedColor, setAInfo.paperColor, 0.5)} 100%)`,
                        borderRadius: '2px 2px 0 0'
                      }}
                    />
                  )}
                </div>
              </div>
              <span className="font-mono text-[11px] text-muted-foreground">
                {tested && chosenSet === 'A' ? `${selectedSample.distance} mm` : 'รอดำเนินการ'}
              </span>
            </div>

            <div className={cn('flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all', chosenSet === 'B' ? 'border-primary bg-card shadow-lg' : 'border-border/50 bg-card/40 opacity-60')}>
              <span className="text-xs font-medium text-muted-foreground">ชุด B (กระดาษเหลือง)</span>
              <div className="relative flex h-64 w-32 items-end justify-center rounded-xl border border-border bg-[#0d1f38] p-4 shadow-inner">
                <div
                  className="relative aspect-[3/4] w-24 rounded-md shadow-lg"
                  style={{ backgroundColor: setBInfo.paperColor }}
                >
                  <div className="absolute bottom-1 left-1/2 size-2.5 -translate-x-1/2 rounded-full border border-white/40 bg-white/10" />
                  {tested && chosenSet === 'B' && (
                    <div
                      className="absolute inset-x-0 bottom-0 animate-migrate"
                      style={{
                        height: `${selectedSample.distance * 3}px`,
                        background: `linear-gradient(to top, ${setBInfo.reactedColor} 0%, ${setBInfo.reactedColor} 88%, ${mixHex(setBInfo.reactedColor, setBInfo.paperColor, 0.5)} 100%)`,
                        borderRadius: '2px 2px 0 0'
                      }}
                    />
                  )}
                </div>
              </div>
              <span className="font-mono text-[11px] text-muted-foreground">
                {tested && chosenSet === 'B' ? `${selectedSample.distance} mm` : 'รอดำเนินการ'}
              </span>
            </div>
          </div>

          {tested && (
            <Notice tone="success" className="w-full text-left">
              <p className="flex items-center gap-1.5 font-semibold text-success-foreground">
                <CheckCircle2 className="size-4 text-green-500" /> สรุปผลและคำอธิบายทางเคมี:
              </p>
              <p className="mt-1 text-xs text-success-foreground/90">{selectedSample.correctDesc}</p>
            </Notice>
          )}

          <Button variant="outline" size="sm" onClick={onBack} className="mt-2">
            <ArrowLeft aria-hidden="true" />
            กลับสู่หน้าหลัก Virtual Lab
          </Button>
        </Panel>
      </div>
    </div>
  )
}
