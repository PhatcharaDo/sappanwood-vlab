'use client'

import { ArrowLeft, Beaker, CheckCircle2, AlertCircle } from 'lucide-react'
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
    correctSet: 'A', // ต้องใช้ชุด A (กระดาษสีแดงเคลือบเบส)
    chemDesc: 'น้ำส้มสายชูมีฤทธิ์เป็นกรดอ่อน เหมาะกับการทดสอบด้วยชุด A (กระดาษสีแดงเคลือบเบส) โดยจะทำปฏิกิริยาเปลี่ยนจากสีแดงเป็นสีเหลือง'
  },
  {
    id: 'lime',
    name: 'น้ำมะนาว (Lime juice)',
    type: 'กรดอ่อน',
    correctSet: 'A', // ต้องใช้ชุด A
    chemDesc: 'น้ำมะนาวมีกรดซิตริก (กรดอ่อน) เหมาะกับการทดสอบด้วยชุด A (กระดาษสีแดงเคลือบเบส) โดยจะเปลี่ยนสีเป็นสีเหลือง-ส้ม'
  },
  {
    id: 'baking-soda',
    name: 'เบกกิ้งโซดา (Baking soda)',
    type: 'เบสอ่อน',
    correctSet: 'B', // ต้องใช้ชุด B (กระดาษสีเหลืองเคลือบกรด)
    chemDesc: 'เบกกิ้งโซดามีฤทธิ์เป็นเบสอ่อน เหมาะกับการทดสอบด้วยชุด B (กระดาษสีเหลืองเคลือบกรด) โดยจะเปลี่ยนจากสีเหลืองเป็นสีแดงสด'
  },
  {
    id: 'soapy-water',
    name: 'น้ำสบู่ (Soapy water)',
    type: 'เบสอ่อน',
    correctSet: 'B', // ต้องใช้ชุด B
    chemDesc: 'น้ำสบู่มีฤทธิ์เป็นเบส เหมาะกับการทดสอบด้วยชุด B (กระดาษสีเหลืองเคลือบกรด) โดยจะเปลี่ยนจากสีเหลืองเป็นสีแดงสดอย่างชัดเจน'
  },
]

type Props = {
  onBack: () => void
}

export function StepHousehold({ onBack }: Props) {
  const [selectedSample, setSelectedSample] = useState(HOUSEHOLD_SAMPLES[0])
  const [selectedSet, setSelectedSet] = useState<'A' | 'B'>('A')
  const [tested, setTested] = useState(false)

  const isCorrect = selectedSet === selectedSample.correctSet
  
  // สีและระยะทางจำลองของแต่ละชุด
  const setAColor = '#ff1a1a' // แดงสด
  const setAReacted = '#f6b319' // เหลือง
  const distanceA = 15

  const setBColor = '#f2c230' // เหลือง
  const setBReacted = '#e60000' // แดงสด
  const distanceB = 25

  return (
    <div className="flex flex-col gap-6">
      <StepHeading
        step={5}
        title="ทดสอบกับสารในครัวเรือน (Real-world Household Testing)"
        subtitle="เลือกสารตัวอย่าง และเลือกชุดกระดาษ µPADs (ชุด A หรือ ชุด B) ที่เหมาะสมในการทดสอบ เพื่อดูการเปลี่ยนสีและปฏิกิริยา"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-foreground">1. เลือกสารตัวอย่างจากครัวเรือน</h3>
          <div className="grid grid-cols-1 gap-2">
            {HOUSEHOLD_SAMPLES.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => {
                  setSelectedSample(sample)
                  setTested(false)
                }}
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

          <h3 className="mt-2 text-sm font-semibold text-foreground">2. เลือกชุดกระดาษ $\mu\text{PADs}$ สำหรับทดสอบ</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedSet('A')
                setTested(false)
              }}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all',
                selectedSet === 'A' ? 'border-red-500 bg-red-500/10 ring-2 ring-red-500/30' : 'border-border bg-card hover:border-red-500/50'
              )}
            >
              <div className="h-10 w-6 rounded bg-[#ff1a1a] shadow" />
              <div>
                <span className="block font-semibold text-foreground">ชุด A</span>
                <span className="text-[11px] text-muted-foreground">กระดาษสีแดง (เคลือบเบส)</span>
              </div>
              {selectedSet === 'A' && <CheckCircle2 className="size-5 text-red-500" />}
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedSet('B')
                setTested(false)
              }}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all',
                selectedSet === 'B' ? 'border-amber-400 bg-amber-400/10 ring-2 ring-amber-400/30' : 'border-border bg-card hover:border-amber-400/50'
              )}
            >
              <div className="h-10 w-6 rounded bg-[#f2c230] shadow" />
              <div>
                <span className="block font-semibold text-foreground">ชุด B</span>
                <span className="text-[11px] text-muted-foreground">กระดาษสีเหลือง (เคลือบกรด)</span>
              </div>
              {selectedSet === 'B' && <CheckCircle2 className="size-5 text-amber-400" />}
            </button>
          </div>

          <Button size="lg" onClick={() => setTested(true)} className="mt-2">
            <Beaker aria-hidden="true" />
            หยด {selectedSample.name} ลงบนกระดาษชุด {selectedSet}
          </Button>
        </Panel>

        <Panel className="flex flex-col items-center justify-center gap-4 text-center">
          <h3 className="text-sm font-semibold text-foreground">ผลการทดสอบกระดาษทั้ง 2 ชุด</h3>

          {/* แสดงกระดาษ 2 ชุดเทียบกัน */}
          <div className="flex items-center justify-center gap-6">
            
            {/* ชุด A */}
            <div className={cn('relative flex h-72 w-32 flex-col items-end justify-center rounded-2xl border p-3 transition-all', selectedSet === 'A' ? 'border-primary bg-primary/5 shadow-md' : 'border-border bg-card/50 opacity-60')}>
              <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-foreground">ชุด A (แดง)</span>
              <div
                className="relative aspect-[3/4] w-20 rounded-md shadow-lg mx-auto mt-6"
                style={{ backgroundColor: setAColor }}
              >
                <div className="absolute bottom-1 left-1/2 size-2.5 -translate-x-1/2 rounded-full border border-white/40 bg-white/20" />
                {tested && selectedSet === 'A' && (
                  <div
                    className="absolute inset-x-0 bottom-0 animate-migrate"
                    style={{
                      height: `${distanceA * 3.5}px`,
                      background: `linear-gradient(to top, ${setAReacted} 0%, ${setAReacted} 85%, ${mixHex(setAReacted, setAColor, 0.5)} 100%)`,
                      borderRadius: '2px 2px 0 0'
                    }}
                  />
                )}
              </div>
              <span className="mx-auto mt-2 font-mono text-[10px] text-muted-foreground">
                {tested && selectedSet === 'A' ? `${distanceA} mm` : 'รอดำเนินการ'}
              </span>
            </div>

            {/* ชุด B */}
            <div className={cn('relative flex h-72 w-32 flex-col items-end justify-center rounded-2xl border p-3 transition-all', selectedSet === 'B' ? 'border-primary bg-primary/5 shadow-md' : 'border-border bg-card/50 opacity-60')}>
              <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-foreground">ชุด B (เหลือง)</span>
              <div
                className="relative aspect-[3/4] w-20 rounded-md shadow-lg mx-auto mt-6"
                style={{ backgroundColor: setBColor }}
              >
                <div className="absolute bottom-1 left-1/2 size-2.5 -translate-x-1/2 rounded-full border border-white/40 bg-white/20" />
                {tested && selectedSet === 'B' && (
                  <div
                    className="absolute inset-x-0 bottom-0 animate-migrate"
                    style={{
                      height: `${distanceB * 3.5}px`,
                      background: `linear-gradient(to top, ${setBReacted} 0%, ${setBReacted} 85%, ${mixHex(setBReacted, setBColor, 0.5)} 100%)`,
                      borderRadius: '2px 2px 0 0'
                    }}
                  />
                )}
              </div>
              <span className="mx-auto mt-2 font-mono text-[10px] text-muted-foreground">
                {tested && selectedSet === 'B' ? `${distanceB} mm` : 'รอดำเนินการ'}
              </span>
            </div>

          </div>

          {tested && (
            <Notice tone={isCorrect ? 'success' : 'warning'} className="w-full text-left">
              <div className="flex items-start gap-2">
                {isCorrect ? (
                  <CheckCircle2 className="size-5 text-success shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="size-5 text-amber-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold">
                    {isCorrect ? 'ถูกต้อง! คุณเลือกชุดกระดาษได้เหมาะสมกับการทดสอบ' : 'ข้อสังเกต: สารนี้ควรใช้ชุดกระดาษอีกชุดหนึ่งในการทดสอบจึงจะเกิดปฏิกิริยาชัดเจน'}
                  </p>
                  <p className="text-xs mt-1 opacity-90">{selectedSample.chemDesc}</p>
                </div>
              </div>
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
