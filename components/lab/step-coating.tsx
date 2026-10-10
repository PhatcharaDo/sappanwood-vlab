'use client'

import { ArrowRight, Flame, Lock, Pipette, RotateCcw, Timer, Wind } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useTimedProgress } from '@/hooks/use-timed-progress'
import { EXTRACT_COLOR, formatClock, mixHex, SET_INFO, type SetId } from '@/lib/lab'
import { cn } from '@/lib/utils'
import { PetriDish } from './glassware'
import { Notice, Panel, ProgressBar, StepHeading } from './lab-ui'

const TARGET_DROPS = 20 // 1 mL = 20 หยดตามมาตรฐาน
const STRIP_COUNT = 5

type Props = {
  done: Record<SetId, boolean>
  onSetComplete: (set: SetId) => void
  onNext: () => void
}

export function StepCoating({ done, onSetComplete, onNext }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <StepHeading
        step={2}
        title="เคลือบกระดาษ µPADs (Set A & Set B)"
        subtitle="ผสมสารสกัดแก่นฝางกับเบสหรือกรดในอัตราส่วน 1:1 (อย่างละ 1 mL หรือ 20 หยด) ในหลอดเอเพนดอร์ฟ (2 mL)"
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <CoatingSet set="A" locked={false} done={done.A} onComplete={() => onSetComplete('A')} />
        <CoatingSet set="B" locked={!done.A} done={done.B} onComplete={() => onSetComplete('B')} />
      </div>
      {done.A && done.B && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Notice tone="success" className="flex-1">
            เตรียมกระดาษ µPADs ครบทั้ง 2 ชุดแล้ว (Set A สีแดง 5 แผ่น และ Set B สีเหลือง 5 แผ่น)
          </Notice>
          <Button size="lg" onClick={onNext}>
            ไปขั้นตอนที่ 3
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>
      )}
    </div>
  )
}

type Phase = 'mix' | 'coat' | 'dry' | 'done'
type DryMethod = 'oven' | 'air'

const DRY_METHODS: Record<DryMethod, { label: string; seconds: number; icon: typeof Flame }> = {
  oven: { label: 'อบในตู้อบ 60°C', seconds: 10 * 60, icon: Flame },
  air: { label: 'ผึ่งลมให้แห้ง', seconds: 30 * 60, icon: Wind },
}

type CoatingSetProps = {
  set: SetId
  locked: boolean
  done: boolean
  onComplete: () => void
}

function CoatingSet({ set, locked, done, onComplete }: CoatingSetProps) {
  const info = SET_INFO[set]
  const [phase, setPhase] = useState<Phase>(done ? 'done' : 'mix')
  const [extractDrops, setExtractDrops] = useState(0)
  const [reagentDrops, setReagentDrops] = useState(0)
  const [coated, setCoated] = useState<boolean[]>(Array(STRIP_COUNT).fill(done))
  const [method, setMethod] = useState<DryMethod>('oven')
  const [dropping, setDropping] = useState<'extract' | 'reagent' | null>(null)

  const dry = useTimedProgress(3500, () => {
    setPhase('done')
    onComplete()
  })

  const balanced = extractDrops === TARGET_DROPS && reagentDrops === TARGET_DROPS
  const mixColor = solutionColor(set, extractDrops, reagentDrops)
  const totalDrops = extractDrops + reagentDrops
  const remainingSeconds = DRY_METHODS[method].seconds * (1 - dry.progress)

  function addExtractDrop() {
    if (locked || extractDrops >= TARGET_DROPS) return
    setDropping('extract')
    setTimeout(() => {
      const randomBatch = Math.floor(Math.random() * 3) + 3 // สุ่ม 3-5 หยดต่อคลิก
      setExtractDrops((d) => Math.min(TARGET_DROPS, d + randomBatch))
      setDropping(null)
    }, 300)
  }

  function addReagentDrop() {
    if (locked || reagentDrops >= TARGET_DROPS) return
    setDropping('reagent')
    setTimeout(() => {
      const randomBatch = Math.floor(Math.random() * 3) + 3 // สุ่ม 3-5 หยดต่อคลิก
      setReagentDrops((d) => Math.min(TARGET_DROPS, d + randomBatch))
      setDropping(null)
    }, 300)
  }

  function resetMix() {
    setExtractDrops(0)
    setReagentDrops(0)
  }

  function coatStrip(index: number) {
    setCoated((prev) => prev.map((value, i) => (i === index ? true : value)))
  }

  const allCoated = coated.every(Boolean)
  const phaseIndex = ['mix', 'coat', 'dry', 'done'].indexOf(phase)

  return (
    <Panel className="relative flex flex-col gap-5 overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {info.title} <span className="text-primary">· {info.purpose}</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            สารสกัด + {info.mixReagent} (1:1) → {info.paperName}
          </p>
        </div>
        <span
          className="h-12 w-4 shrink-0 rounded-sm border border-border"
          style={{ backgroundColor: info.paperColor }}
          aria-hidden="true"
        />
      </div>

      <ol className="grid grid-cols-4 gap-1.5 text-center text-[11px]" aria-label={`ความคืบหน้า ${info.title}`}>
        {['ผสมสาร 1:1', 'เคลือบ 5 แผ่น', 'ทำให้แห้ง', 'จานเพาะเชื้อ'].map((label, i) => (
          <li
            key={label}
            className={cn(
              'rounded-md border px-1 py-1.5',
              i < phaseIndex || phase === 'done'
                ? 'border-success/40 bg-success/10 text-success'
                : i === phaseIndex
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground',
            )}
          >
            {label}
          </li>
        ))}
      </ol>

      {phase === 'mix' && (
        <div className="relative grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] sm:items-center">
          {dropping && (
            <div className="absolute top-4 left-1/4 z-20 flex flex-col items-center animate-bounce">
              <Pipette className="size-8 text-primary drop-shadow-[0_0_6px_rgba(250,204,21,0.8)] rotate-180" />
            </div>
          )}

          {/* หลอดเอเพนดอร์ฟ 2 mL (ว่างเปล่าเมื่อ 0 หยด) */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative flex h-48 w-20 flex-col justify-end overflow-hidden rounded-b-2xl rounded-t-md border-2 border-slate-400/60 bg-slate-900/40 p-1 shadow-inner">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-4 w-12 rounded-t-md bg-slate-500 border border-slate-300" />
              {totalDrops > 0 && (
                <div
                  className="w-full rounded-b-xl transition-all duration-300 relative flex items-center justify-center"
                  style={{
                    height: `${(totalDrops / 40) * 100}%`,
                    backgroundColor: mixColor,
                  }}
                >
                  <span className="text-[10px] font-bold text-white/90 drop-shadow-md">
                    {totalDrops} หยด ({(totalDrops / 20).toFixed(1)} mL)
                  </span>
                </div>
              )}
            </div>
            <span className="text-xs text-muted-foreground font-medium">หลอดเอเพนดอร์ฟ (2 mL)</span>
          </div>

          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="secondary"
                size="lg"
                onClick={addExtractDrop}
                disabled={locked || dropping !== null || extractDrops >= TARGET_DROPS}
              >
                <Pipette aria-hidden="true" />
                สารสกัด ({extractDrops}/20)
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={addReagentDrop}
                disabled={locked || dropping !== null || reagentDrops >= TARGET_DROPS}
              >
                <Pipette aria-hidden="true" />
                {info.mixReagent} ({reagentDrops}/20)
              </Button>
            </div>
            <dl className="grid grid-cols-2 gap-2 text-center">
              <div className="rounded-lg border border-border bg-muted p-2">
                <dt className="text-[11px] text-muted-foreground">สารสกัด ({(extractDrops / 20).toFixed(1)} mL)</dt>
                <dd className="font-mono text-lg font-semibold text-primary">{extractDrops} หยด</dd>
              </div>
              <div className="rounded-lg border border-border bg-muted p-2">
                <dt className="text-[11px] text-muted-foreground">{info.mixReagent} ({(reagentDrops / 20).toFixed(1)} mL)</dt>
                <dd className="font-mono text-lg font-semibold text-primary">{reagentDrops} หยด</dd>
              </div>
            </dl>
            <p className="text-xs text-muted-foreground leading-relaxed" aria-live="polite">
              *มาตรฐาน: <span className="text-foreground font-medium">1 mL = 20 หยด</span> (ใช้สารสกัด 1 mL และรีเอเจนต์ 1 mL รวมเป็น 2 mL เต็มหลอด)<br />
              อัตราส่วน{' '}
              <span className="font-mono text-foreground">
                {extractDrops}:{reagentDrops}
              </span>{' '}
              {totalDrops === 0
                ? '— หยดสารสกัดและรีเอเจนต์สลับกันให้สะสมครบอย่างละ 20 หยด'
                : balanced
                  ? `— ครบอัตราส่วน 1:1 (อย่างละ 1 mL) แล้ว สารละลายเปลี่ยนเป็น${set === 'A' ? 'สีแดง' : 'สีเหลือง'}`
                  : '— กำลังผสม (หยดสลับสะสมให้ครบอย่างละ 20 หยด)'}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="lg" onClick={() => setPhase('coat')} disabled={!balanced || locked}>
                ยืนยันสารละลาย
              </Button>
              <Button size="lg" variant="outline" onClick={resetMix} disabled={locked || totalDrops === 0}>
                <RotateCcw aria-hidden="true" />
                เทผสมใหม่
              </Button>
            </div>
          </div>
        </div>
      )}

      {phase === 'coat' && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">คลิกที่กระดาษแต่ละแผ่นเพื่อจุ่ม/เคลือบด้วยสารละลาย (ครบ 5 แผ่น)</p>
          <div className="flex items-end justify-center gap-4 rounded-xl bg-muted p-5">
            {coated.map((isCoated, i) => (
              <button
                key={i}
                type="button"
                onClick={() => coatStrip(i)}
                disabled={isCoated}
                aria-label={`เคลือบกระดาษแผ่นที่ ${i + 1}${isCoated ? ' (เคลือบแล้ว)' : ''}`}
                className={cn(
                  'flex h-32 w-8 items-end justify-center rounded-sm border pb-1 font-mono text-[10px] transition-colors duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                  isCoated
                    ? 'border-transparent text-white/85'
                    : 'border-border bg-[#f5f1e8] text-slate-500 hover:ring-2 hover:ring-primary',
                )}
                style={isCoated ? { backgroundColor: info.paperColor, color: set === 'B' ? '#5b4300' : undefined } : undefined}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <Button size="lg" onClick={() => setPhase('dry')} disabled={!allCoated} className="self-start">
            เคลือบครบแล้ว นำไปทำให้แห้ง
          </Button>
        </div>
      )}

      {phase === 'dry' && (
        <div className="flex flex-col gap-4">
          <fieldset className="flex flex-col gap-2" disabled={dry.running}>
            <legend className="mb-2 text-sm text-muted-foreground">เลือกวิธีทำให้กระดาษแห้ง</legend>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(DRY_METHODS) as DryMethod[]).map((key) => {
                const Icon = DRY_METHODS[key].icon
                return (
                  <label
                    key={key}
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring',
                      method === key ? 'border-primary bg-primary/10 text-foreground' : 'border-border text-muted-foreground',
                    )}
                  >
