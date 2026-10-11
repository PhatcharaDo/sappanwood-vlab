'use client'

import { ArrowLeft, Beaker, CheckCircle2 } from 'lucide-react'
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
    baseSetId: 'A',
    basePaperColor: '#ff1a1a',
    finalColor: '#f6b319', 
    distance: 15
    chemDesc: 'มีกรดแอซีติก (Acetic acid) เป็นองค์ประกอบ มีฤทธิ์เป็นกรดอ่อน ทำปฏิกิริยากับเบสที่เคลือบไว้บนกระดาษ ทำให้กระดาษสีแดงเปลี่ยนเป็นสีเหลือง'
  },
{
    id: 'lime',
    name: 'น้ำมะนาว (Lime juice)',
    type: 'กรดอ่อน',
    baseSetId: 'A',
    basePaperColor: '#ff1a1a',
    finalColor: '#f59e0b',
    distance: 18,
    chemDesc: 'มีกรดซิตริก (Citric acid) มีฤทธิ์เป็นกรด ทำปฏิกิริยาสะเทินกับเบสบนกระดาษ ทำให้กระดาษสีแดงเปลี่ยนเป็นสีเหลือง-ส้ม'
  },
{
    id: 'baking-soda',
    name: 'เบกกิ้งโซดา (Baking soda)',
    type: 'เบสอ่อน',
    baseSetId: 'B',
    basePaperColor: '#f2c230',
    finalColor: '#e60000',
    distance: 28,
    chemDesc: 'มีฤทธิ์เป็นเบสอ่อน ทำปฏิกิริยากับกรดที่เคลือบไว้บนกระดาษ ทำให้กระดาษสีเหลืองเปลี่ยนเป็นสีแดง'
  },
{
    id: 'soapy-water',
    name: 'น้ำสบู่ (Soapy water)',
    type: 'เบสอ่อน',
    baseSetId: 'B',
    basePaperColor: '#f2c230',
    finalColor: '#e60000',
    distance: 22,
    chemDesc: 'มีฤทธิ์เป็นเบส ทำปฏิกิริยากับกรดที่เคลือบไว้บนกระดาษ ทำให้กระดาษสีเหลืองเปลี่ยนเป็นสีแดง'
  },
]

type Props = {
  onBack: () => void
}

export function StepHousehold({ onBack }: Props) {
  const [selectedSample, setSelectedSample] = useState(HOUSEHOLD_SAMPLES[0])
  const [tested, setTested] = useState(false)

  const reactedColor = mixHex(selectedSample.basePaperColor, selectedSample.finalColor, 0.8)

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
                  <span className="text-xs text-muted-foreground">ประเภท: {sample.type} (อิงชุดทดสอบ {sample.baseSetId})</span>
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

          <div className="relative flex h-80 w-64 items-end justify-center rounded-2xl border border-border bg-[#0d1f38] p-6 shadow-inner">
            <div
              className="relative aspect-[3/4] w-48 rounded-md shadow-lg"
              style={{ backgroundColor: selectedSample.basePaperColor }}
            >
              <div className="absolute bottom-1 left-1/2 size-3 -translate-x-1/2 rounded-full border border-white/40 bg-white/10" />

              {tested && (
                <div
                  className="absolute inset-x-0 bottom-0 animate-migrate"
                  style={{
                    height: `${selectedSample.distance * 4}px`,
                    background: `linear-gradient(to top, ${reactedColor} 0%, ${reactedColor} 88%, ${mixHex(reactedColor, selectedSample.basePaperColor, 0.5)} 100%)`,
                    borderRadius: '2px 2px 0 0'
                  }}
                />
              )}
            </div>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
              <span className="font-mono text-[11px] text-muted-foreground">
                {tested ? `ระยะทางเคลื่อนที่: ${selectedSample.distance} mm` : 'รอดำเนินการหยดสาร...'}
              </span>
            </div>
          </div>

          {tested && (
            <Notice tone="success" className="w-full text-left">
              <p className="font-semibold text-success-foreground">คำอธิบายทางเคมี:</p>
              <p className="text-xs mt-1 text-success-foreground/80">{selectedSample.chemDesc}</p>
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
