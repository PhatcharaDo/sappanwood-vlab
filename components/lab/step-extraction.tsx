'use client'

import { ArrowRight, Droplets, Filter, Hourglass, RotateCcw, Wand2 } from 'lucide-react'
import { type DragEvent, type ReactNode, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useTimedProgress } from '@/hooks/use-timed-progress'
import { EXTRACT_COLOR, mixHex } from '@/lib/lab'
import { cn } from '@/lib/utils'
import { BeakerGraphic, FilterSetupGraphic } from './glassware'
import { Notice, Panel, ProcedureList, ProgressBar, StepHeading } from './lab-ui'

const PROCEDURE = [
  'ใส่ผงแก่นฝาง 20.0 g ลงในบีกเกอร์ขนาด 100 mL (คลิกหรือลากผงแก่นฝางไปที่บีกเกอร์)',
  'เทเอทานอล 75% V/V ปริมาตร 20 mL ลงในบีกเกอร์ (คลิกหรือลากขวดเอทานอล)',
  'ใช้แท่งแก้วคนสาร คนให้เข้ากันเป็นเวลา 30 วินาที',
  'ทิ้งไว้ 1 วัน (Resting 1 day)',
  'เทกรองผ่านกรวยกรองและกระดาษกรอง จนกรองเสร็จ',
]

const ETHANOL_COLOR = '#e3ecf6'

type Props = {
  done: boolean
  onComplete: () => void
  onNext: () => void
}

export function StepExtraction({ done, onComplete, onNext }: Props) {
  const [stage, setStage] = useState(done ? 5 : 0)
  const [dragOver, setDragOver] = useState(false)

  const pour = useTimedProgress(1600, () => setStage(2))
  const stir = useTimedProgress(6000, () => setStage(3))
  const rest = useTimedProgress(3200, () => setStage(4))
  const filter = useTimedProgress(4500, () => {
    setStage(5)
    onComplete()
  })

  const ethanolMl = stage >= 2 ? 20 : pour.progress * 20
  const stirSeconds = stage >= 3 ? 30 : stir.progress * 30
  const restHours = stage >= 4 ? 24 : rest.progress * 24
  const filterProgress = stage >= 5 ? 1 : filter.progress

  const tint = stage >= 3 ? 1 : 0.12 + stir.progress * 0.88
  const liquidColor = mixHex(ETHANOL_COLOR, EXTRACT_COLOR, stage >= 1 ? tint : 0)
  // ปรับระดับความสูงภาพในบีกเกอร์ให้แสดงผลสวยงามพอดี (ระดับประมาณ 30 mL เดิม) โดยปริมาณสารยังคงเป็น 20.0 mL ตามจริง
  const beakerLevel = (stage >= 2 ? 0.3 : pour.progress * 0.3) * (1 - filterProgress * 0.92)

  function addPowder() {
    if (stage === 0) setStage(1)
  }

  function addEthanol() {
    if (stage === 1) pour.start()
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragOver(false)
    const item = event.dataTransfer.getData('text/plain')
    if (item === 'powder') addPowder()
    if (item === 'ethanol') addEthanol()
  }

  function restart() {
    pour.reset()
    stir.reset()
    rest.reset()
    filter.reset()
    setStage(0)
  }

  return (
    <div className="flex flex-col gap-6">
      <StepHeading
        step={1}
        title="การสกัดสารจากแก่นฝาง (Sappanwood Extraction)"
        subtitle="สกัดสารบราซิลิน (Brazilin) จากผงแก่นฝางด้วยเอทานอล 75% V/V ในปริมาณน้อย ตามหลักเคมีแบบย่อส่วนและเคมีสีเขียว"
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,1.6fr)]">
        <Panel className="flex flex-col gap-5">
          <h3 className="text-sm font-semibold text-foreground">ขั้นตอนการทดลอง</h3>
          <ProcedureList items={PROCEDURE} current={stage} />

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-foreground">อุปกรณ์และสารเคมี</h3>
            <div className="grid grid-cols-2 gap-2">
              <EquipmentCard
                dragId="powder"
                enabled={stage === 0}
                used={stage > 0}
                onClick={addPowder}
                swatch={<span className="size-6 rounded-md bg-[#7a3e1d] shadow-inner" />}
                name="ผงแก่นฝาง"
                detail="20.0 g"
              />
              <EquipmentCard
                dragId="ethanol"
                enabled={stage === 1 && !pour.running}
                used={stage > 1}
                onClick={addEthanol}
                swatch={<Droplets className="size-6 text-[#bcd3ee]" aria-hidden="true" />}
                name="เอทานอล 75% V/V"
                detail="20 mL"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted p-4">
            {stage <= 1 && !pour.running && (
              <p className="text-sm text-muted-foreground">
                {stage === 0 ? 'เริ่มจากใส่ผงแก่นฝางลงในบีกเกอร์' : 'เทเอทานอล 75% V/V ลงในบีกเกอร์'}
              </p>
            )}
            {(pour.running || stage === 2) && (
              <>
                <ProgressBar value={stage >= 2 && !pour.running ? stir.progress : pour.progress} label={pour.running ? `กำลังเทเอทานอล ${ethanolMl.toFixed(1)} / 20.0 mL` : `คนสาร ${stirSeconds.toFixed(0)} / 30 วินาที (จำลองเวลา)`} />
                {stage === 2 && (
                  <Button size="lg" onClick={stir.start} disabled={stir.running} className="self-start">
                    <Wand2 aria-hidden="true" />
                    {stir.running ? 'กำลังคนด้วยแท่งแก้ว...' : 'ใช้แท่งแก้วคนสาร 30 วินาที'}
                  </Button>
                )}
              </>
            )}
            {stage === 3 && (
              <>
                <p className="flex items-center gap-2 text-base font-semibold text-primary">
                  <Hourglass className="size-5" aria-hidden="true" />
                  ทิ้งไว้ 1 วัน (Resting 1 day)
                </p>
                <ProgressBar value={rest.progress} label={`เวลาผ่านไป ${restHours.toFixed(0)} / 24 ชั่วโมง`} />
                <Button size="lg" onClick={rest.start} disabled={rest.running} className="self-start">
                  <Hourglass aria-hidden="true" />
                  {rest.running ? 'กำลังรอ...' : 'เริ่มพักสาร 1 วัน (เร่งเวลา)'}
                </Button>
              </>
            )}
            {stage === 4 && (
              <>
                <ProgressBar value={filter.progress} label="การกรองสารละลาย" />
                <Button size="lg" onClick={filter.start} disabled={filter.running} className="self-start">
                  <Filter aria-hidden="true" />
                  {filter.running ? 'กำลังกรอง...' : 'เทกรองผ่านกรวยกรอง'}
                </Button>
              </>
            )}
            {stage === 5 && (
              <Notice tone="success">
                กรองเสร็จสิ้น! ได้สารสกัดบราซิลิน (Brazilin) สีแดงส้มสด พร้อมนำไปเตรียมกระดาษ µPADs
              </Notice>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {stage === 5 && (
              <Button size="lg" onClick={onNext}>
                ไปขั้นตอนที่ 2
                <ArrowRight aria-hidden="true" />
              </Button>
            )}
            <Button size="lg" variant="outline" onClick={restart}>
              <RotateCcw aria-hidden="true" />
              เริ่มสกัดใหม่
            </Button>
          </div>
        </Panel>

        <Panel className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-foreground">โต๊ะปฏิบัติการ</h3>
          <div className="grid grid-cols-2 items-end gap-4 rounded-xl bg-[linear-gradient(180deg,#0f2440_0%,#0d1f38_80%,#2a3f5f_80%,#2a3f5f_100%)] p-4 md:gap-8 md:p-8">
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border-2 border-dashed p-2 transition-colors',
                dragOver ? 'border-primary bg-primary/10' : 'border-transparent',
              )}
            >
              <BeakerGraphic
                level={stage >= 1 ? beakerLevel : 0}
                color={liquidColor}
                powder={stage >= 1}
                rod={stage === 2 || stage === 3}
                stirring={stir.running}
                title={`บีกเกอร์ 100 mL: ${stage >= 1 ? 'มีผงแก่นฝาง 20.0 g' : 'ว่าง'}${ethanolMl > 0 ? ` และเอทานอล ${ethanolMl.toFixed(1)} mL` : ''}`}
                className="max-w-56"
              />
              <span className="text-xs text-muted-foreground">บีกเกอร์ 100 mL (จุดวางสาร)</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FilterSetupGraphic
                funnelLevel={filter.running ? 1 - filter.progress : 0}
                flaskLevel={filterProgress}
                color={EXTRACT_COLOR}
                dripping={filter.running}
                title={`ชุดกรอง: ได้สารสกัด ${Math.round(filterProgress * 100)}%`}
                className="max-w-48"
              />
              <span className="text-xs text-muted-foreground">กรวยกรองและขวดรูปชมพู่</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <Readout label="ผงแก่นฝาง" value={stage >= 1 ? '20.0 g' : '0.0 g'} />
            <Readout label="เอทานอล 75%" value={`${ethanolMl.toFixed(1)} mL`} />
            <Readout label="สารสกัดที่ได้" value={`${Math.round(filterProgress * 100)}%`} />
          </div>
        </Panel>
      </div>
    </div>
  )
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted px-2 py-2">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="font-mono text-sm font-semibold text-primary">{value}</p>
    </div>
  )
}

type EquipmentCardProps = {
  dragId: string
  enabled: boolean
  used: boolean
  onClick: () => void
  swatch: ReactNode
  name: string
  detail: string
}

function EquipmentCard({ dragId, enabled, used, onClick, swatch, name, detail }: EquipmentCardProps) {
  return (
    <button
      type="button"
      draggable={enabled}
      onDragStart={(e) => e.dataTransfer.setData('text/plain', dragId)}
      onClick={onClick}
      disabled={!enabled}
      className={cn(
        'flex items-center gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-ring',
        enabled && 'cursor-grab border-primary bg-primary/10 hover:bg-primary/20 active:cursor-grabbing',
        !enabled && 'cursor-not-allowed border-border opacity-50',
      )}
    >
      <span className="flex size-10 items-center justify-center rounded-lg bg-background">{swatch}</span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-foreground">{name}</span>
        <span className="block font-mono text-xs text-muted-foreground">{used ? 'ใช้แล้ว' : detail}</span>
      </span>
    </button>
  )
}
