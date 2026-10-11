'use client'

import { ArrowLeft, Beaker, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Notice, Panel, StepHeading } from './lab-ui'
import { cn } from '@/lib/utils'

const HOUSEHOLD_SAMPLES = [
  { id: 'vinegar', name: 'น้ำส้มสายชู (Vinegar)', type: 'กรดอ่อน', desc: 'มีกรดแอซีติก (Acetic acid) เป็นองค์ประกอบ ให้ผลการเปลี่ยนสีและระยะทางใกล้เคียงกับกรดมาตรฐาน', distance: 15, color: '#f6b319' },
  { id: 'lime', name: 'น้ำมะนาว (Lime juice)', type: 'กรดอ่อน', desc: 'มีกรดซิตริก (Citric acid) ทำปฏิกิริยากับกระดาษสกัดแก่นฝาง เปลี่ยนเป็นโทนสีส้มอมเหลือง', distance: 18, color: '#f59e0b' },
  { id: 'baking-soda', name: 'เบกกิ้งโซดา (Baking soda)', type: 'เบสอ่อน', desc: 'มีโซเดียมไบคาร์บอเนต ให้ฤทธิ์เป็นเบส ทำให้กระดาษเปลี่ยนสีไปทางโทนม่วง/แดงเข้ม', distance: 28, color: '#8e1b5b' },
  { id: 'soapy-water', name: 'น้ำสบู่ (Soapy water)', type: 'เบสอ่อน', desc: 'มีฤทธิ์เป็นเบสอ่อนเช่นกัน ทดสอบการเปลี่ยนสีของกระดาษ µPADs สีแดงและเหลือง', distance: 22, color: '#701a75' },
]

type Props = {
  onBack: () => void
}

export function StepHousehold({ onBack }: Props) {
  const [selectedSample, setSelectedSample] = useState(HOUSEHOLD_SAMPLES[0])
  const [tested, setTested] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <StepHeading
        step={5}
        title="ทดสอบกับสารในครัวเรือน (Real-world Household Testing)"
        subtitle="นำองค์ความรู้จากกระดาษ µPADs สกัดแก่นฝาง มาทดสอบกับสารละลายในชีวิตประจำวัน เพื่อดูการตอบสนองของสีและระยะการเคลื่อนที่"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-foreground">เลือกสารตัวอย่างจากครัวเรือน</h3>
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

          <Button size="lg" onClick={() => setTested(true)} className="mt-2">
            <Beaker aria-hidden="true" />
            หยดสารทดสอบลงบนกระดาษ µPADs
          </Button>
        </Panel>

        <Panel className="flex flex-col items-center justify-center gap-4 text-center">
          <h3 className="text-sm font-semibold text-foreground">ผลการทดสอบ: {selectedSample.name}</h3>
          
          <div className="relative flex h-64 w-48 flex-col items-center justify-end rounded-2xl border border-border bg-[#0d1f38] p-4 shadow-inner">
            <div
              className="w-8 rounded-t transition-all duration-700"
              style={{
                height: tested ? `${selectedSample.distance * 3}px` : '10px',
                backgroundColor: tested ? selectedSample.color : '#c8102e',
              }}
            />
            <span className="mt-3 font-mono text-xs text-muted-foreground">
              {tested ? `ระยะทางเคลื่อนที่: ${selectedSample.distance} mm` : 'รอดำเนินการหยดสาร...'}
            </span>
          </div>

          {tested && (
            <Notice tone="success" className="w-full text-left">
              <p className="font-semibold">ข้อสังเกตทางเคมี:</p>
              <p className="text-xs mt-1">{selectedSample.desc}</p>
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
