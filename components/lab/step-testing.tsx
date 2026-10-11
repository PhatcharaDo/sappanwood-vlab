'use client'

import { ArrowRight, Pipette, Ruler } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CONCENTRATIONS, SET_IDS, SET_INFO, type SetId } from '@/lib/lab'
import { cn } from '@/lib/utils'
import { Notice, Panel, StepHeading } from './lab-ui'
import { TestBench } from './test-bench'

const WARNING = 'ทำไม่ได้! ต้องเปลี่ยนความเข้มข้นหรือหยดให้ถูกต้อง'

type Props = {
  tested: Record<SetId, boolean[]>
  distances: Record<SetId, number[]>
  onTest: (set: SetId, index: number) => void
  onNext: () => void
}

export function StepTesting({ tested, distances, onTest, onNext }: Props) {
  const [activeSet, setActiveSet] = useState<SetId>('A')
  const [selected, setSelected] = useState<Record<SetId, number | null>>({ A: null, B: null })
  const [warning, setWarning] = useState<string | null>(null)
  const [animateIndex, setAnimateIndex] = useState<Record<SetId, number | null>>({ A: null, B: null })

  const info = SET_INFO[activeSet]
  const setTested = tested[activeSet]
  const nextIndex = setTested.indexOf(false)
  const selectedIndex = selected[activeSet]
  const allDone = SET_IDS.every((id) => tested[id].every(Boolean))

  function handleStripClick(index: number) {
    if (setTested[index]) {
      setWarning(`แถบที่ ${index + 1} ถูกหยดสารไปแล้ว ไม่สามารถหยดซ้ำได้`)
      return
    }
    if (selectedIndex === null) {
      setWarning('ยังไม่ได้เลือกความเข้มข้นของสารที่จะหยด')
      return
    }
    if (selectedIndex !== index) {
      setWarning(
        `เลือกสาร ${CONCENTRATIONS[selectedIndex].toFixed(1)} M แต่แถบที่ ${index + 1} ใช้สำหรับ ${CONCENTRATIONS[index].toFixed(1)} M`,
      )
      return
    }
    if (index !== nextIndex) {
      setWarning(`ต้องทดสอบทีละแถบตามลำดับ — แถบถัดไปคือแถบที่ ${nextIndex + 1} (${CONCENTRATIONS[nextIndex].toFixed(1)} M)`)
      return
    }
    setWarning(null)
    setAnimateIndex((prev) => ({ ...prev, [activeSet]: index }))
    setSelected((prev) => ({ ...prev, [activeSet]: null }))
    onTest(activeSet, index)
  }

  function switchSet(id: SetId) {
    setActiveSet(id)
    setWarning(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <StepHeading
        step={3}
        title="ทดลองหยดสาร 0.1 - 0.5 M (Capillary Action)"
        subtitle="เลือกความเข้มข้นของสาร แล้วหยดลงบนกระดาษ µPADs ทีละแถบตามลำดับ สังเกตการเคลื่อนที่ของสารตามแรงแคพิลลารีและการเปลี่ยนสีของกระดาษ"
      />

      <div role="tablist" aria-label="เลือกชุดกระดาษทดสอบ" className="grid grid-cols-2 gap-2 sm:inline-grid sm:w-fit">
        {SET_IDS.map((id) => {
          const count = tested[id].filter(Boolean).length
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeSet === id}
              onClick={() => switchSet(id)}
              className={cn(
                'flex items-center gap-3 rounded-xl border px-4 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-ring',
                activeSet === id ? 'border-primary bg-primary/10' : 'border-border bg-card hover:border-primary/60',
              )}
            >
              <span className="h-8 w-3 rounded-sm" style={{ backgroundColor: SET_INFO[id].paperColor }} aria-hidden="true" />
              <span>
                <span className="block text-sm font-semibold text-foreground">
                  {SET_INFO[id].title} · {SET_INFO[id].purpose}
                </span>
                <span className="block font-mono text-xs text-muted-foreground">{count}/5 แถบ</span>
              </span>
            </button>
          )
        })}
      </div>

      {warning && (
        <Notice tone="warning">
          <p className="font-semibold">{WARNING}</p>
          <p className="text-destructive/80">{warning}</p>
        </Notice>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <Panel className="flex flex-col gap-5">
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Pipette className="size-4 text-primary" aria-hidden="true" />
              เลือกความเข้มข้นของ{info.testReagent} ({info.testFormula})
            </legend>
            <div className="grid grid-cols-5 gap-1.5 lg:grid-cols-1">
              {CONCENTRATIONS.map((conc, i) => {
                const done = setTested[i]
                return (
                  <label
                    key={conc}
                    className={cn(
                      'flex cursor-pointer flex-col items-center justify-between gap-1 rounded-lg border px-2 py-2 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring lg:flex-row lg:px-3',
                      selectedIndex === i ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-muted text-foreground hover:border-primary/60',
                    )}
                  >
                    <input
                      type="radio"
                      name={`conc-${activeSet}`}
                      value={conc}
                      checked={selectedIndex === i}
                      onChange={() => setSelected((prev) => ({ ...prev, [activeSet]: i }))}
                      className="sr-only"
                    />
                    <span className="font-mono font-semibold">
                      <span className="hidden lg:inline">{info.testFormula} </span>
                      {conc.toFixed(1)} M
                    </span>
                    <span className={cn('text-[10px]', selectedIndex === i ? 'text-primary-foreground/80' : done ? 'text-success' : 'text-muted-foreground')}>
                      {done ? 'หยดแล้ว' : 'ยังไม่หยด'}
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          <Notice>
            {nextIndex === -1 ? (
              <span>
                {info.title} ทดสอบครบ 5 แถบแล้ว
                {!allDone && ' — สลับไปทดสอบอีกชุดหนึ่ง'}
              </span>
            ) : selectedIndex === null ? (
              <span>เลือกความเข้มข้น แล้วคลิกที่แถบกระดาษที่ตรงกันเพื่อหยดสาร</span>
            ) : (
              <span>
                ถือหลอดหยดสาร {info.testFormula} {CONCENTRATIONS[selectedIndex].toFixed(1)} M — คลิกที่แถบกระดาษเพื่อหยด
              </span>
            )}
          </Notice>

          <div className="flex flex-col gap-2 text-xs leading-relaxed text-muted-foreground">
            <p className="flex items-center gap-2 font-semibold text-foreground">
              <Ruler className="size-4 text-primary" aria-hidden="true" />
              การใช้ไม้บรรทัดเสมือน
            </p>
            <p>ลากไม้บรรทัดไปวางข้างแถบกระดาษ (หรือคลิกแล้วกดลูกศรซ้าย/ขวา) อ่านค่าระยะทางจากจุดหยด (0 mm) ถึงขอบบนของสีที่เปลี่ยน แล้วจดบันทึกไว้ใช้ในขั้นตอนที่ 4</p>
          </div>
        </Panel>

        <Panel className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-foreground">
              {info.title}: {info.paperName} + {info.testReagent}
            </h3>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-3 rounded-sm" style={{ backgroundColor: info.paperColor }} aria-hidden="true" />
                ก่อนทำปฏิกิริยา
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-3 rounded-sm" style={{ backgroundColor: info.reactedColor }} aria-hidden="true" />
                หลังทำปฏิกิริยา
              </span>
            </div>
          </div>
          <TestBench
            key={activeSet}
            set={activeSet}
            tested={setTested}
            distances={distances[activeSet]}
            animateIndex={animateIndex[activeSet]}
            selectedIndex={selectedIndex}
            onStripClick={handleStripClick}
          />
        </Panel>
      </div>

      {allDone && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Notice tone="success" className="flex-1">
            ทดสอบครบทั้ง Set A และ Set B แล้ว อย่าลืมวัดและจดบันทึกระยะทางการเคลื่อนที่ของแต่ละแถบ
          </Notice>
          <Button size="lg" onClick={onNext}>
            ไปขั้นตอนที่ 4
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>
      )}
    </div>
  )
}
