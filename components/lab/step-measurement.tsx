'use client'

import { ChartLine, Eye, EyeOff, RotateCcw, Ruler } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { CONCENTRATIONS, SET_IDS, SET_INFO, type SetId, TOLERANCE_MM } from '@/lib/lab'
import { cn } from '@/lib/utils'
import { DistanceChart } from './distance-chart'
import { Notice, Panel, StepHeading } from './lab-ui'
import { TestBench } from './test-bench'

type CellError = 'missing' | 'invalid' | 'off'

const emptyInputs = (): Record<SetId, string[]> => ({ A: Array(5).fill(''), B: Array(5).fill('') })

type Props = {
  distances: Record<SetId, number[]>
  onComplete: () => void
}

export function StepMeasurement({ distances, onComplete }: Props) {
  // โหลดข้อมูลตารางจาก sessionStorage เพื่อคงสภาพเดิมเวลาสลับหน้า
  const [inputs, setInputs] = useState<Record<SetId, string[]>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('lab_measurement_inputs_v2')
        if (saved) return JSON.parse(saved)
      } catch (e) {
        // ignore
      }
    }
    return emptyInputs()
  })

  // โหลดสถานะกราฟจาก sessionStorage
  const [plotted, setPlotted] = useState<Record<SetId, number[]> | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('lab_measurement_plotted_v2')
        if (saved) return JSON.parse(saved)
      } catch (e) {
        // ignore
      }
    }
    return null
  })

  const [errors, setErrors] = useState<Record<string, CellError>>({})
  const [showLookback, setShowLookback] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [lookbackSet, setLookbackSet] = useState<SetId>('A')

  // บันทึกลง sessionStorage อัตโนมัติทุกครั้งที่มีการเปลี่ยนแปลง
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('lab_measurement_inputs_v2', JSON.stringify(inputs))
      if (plotted) {
        sessionStorage.setItem('lab_measurement_plotted_v2', JSON.stringify(plotted))
      } else {
        sessionStorage.removeItem('lab_measurement_plotted_v2')
      }
    }
  }, [inputs, plotted])

  function updateCell(set: SetId, index: number, value: string) {
    setInputs((prev) => ({ ...prev, [set]: prev[set].map((v, i) => (i === index ? value : v)) }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[`${set}-${index}`]
      return next
    })
  }

  function plotGraph() {
    const found: Record<string, CellError> = {}
    const parsed: Record<SetId, number[]> = { A: [], B: [] }
    for (const set of SET_IDS) {
      inputs[set].forEach((raw, i) => {
        const value = Number(raw.trim().replace(',', '.'))
        const key = `${set}-${i}`
        const actualDistance = distances[set][i] // ใช้ค่าสุ่มจริงที่ส่งมาจาก VirtualLab
        if (raw.trim() === '') found[key] = 'missing'
        else if (!Number.isFinite(value) || value < 0) found[key] = 'invalid'
        else if (Math.abs(value - actualDistance) > TOLERANCE_MM) found[key] = 'off'
        parsed[set].push(value)
      })
    }
    setErrors(found)
    if (Object.keys(found).length === 0) {
      setPlotted(parsed)
      onComplete()
    } else {
      setPlotted(null)
    }
  }

  function resetTable() {
    setInputs(emptyInputs())
    setErrors({})
    setPlotted(null)
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('lab_measurement_inputs_v2')
      sessionStorage.removeItem('lab_measurement_plotted_v2')
    }
  }

  const errorEntries = Object.entries(errors)
  const counts = {
    missing: errorEntries.filter(([, e]) => e === 'missing').length,
    invalid: errorEntries.filter(([, e]) => e === 'invalid').length,
    off: errorEntries.filter(([, e]) => e === 'off').length,
  }

  return (
    <div className="flex flex-col gap-6">
      <StepHeading
        step={4}
        title="วัดระยะทาง & พล็อตกราฟ (Measurement & Graph)"
        subtitle="กรอกระยะทางการเคลื่อนที่ (mm) ที่วัดได้จากขั้นตอนที่ 3 ลงในตาราง แล้วกด Plot Graph เพื่อสร้างกราฟความสัมพันธ์ระหว่างความเข้มข้นกับระยะทาง"
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <Panel className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-foreground">ตารางบันทึกผลการทดลอง</h3>
          <div className="overflow-x-auto pb-2">
            <table className="w-full min-w-[500px] border-separate border-spacing-0 text-sm">
              <caption className="sr-only">ระยะทางการเคลื่อนที่ (mm) ของสารแต่ละความเข้มข้นบนกระดาษ Set A และ Set B</caption>
              <thead>
                <tr>
                  <th scope="col" className="rounded-tl-lg border-b border-border bg-muted px-3 py-2.5 text-left font-medium text-muted-foreground">
                    ความเข้มข้น (M)
                  </th>
                  {SET_IDS.map((id, idx) => (
                    <th
                      key={id}
                      scope="col"
                      className={cn('border-b border-border bg-muted px-3 py-2.5 text-left font-medium text-foreground', idx === 1 && 'rounded-tr-lg')}
                    >
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-2 rounded-sm" style={{ backgroundColor: SET_INFO[id].paperColor }} aria-hidden="true" />
                        {SET_INFO[id].title} (mm)
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CONCENTRATIONS.map((conc, i) => (
                  <tr key={conc}>
                    <th scope="row" className="border-b border-border px-3 py-2 text-left font-mono font-semibold text-primary">
                      {conc.toFixed(1)}
                    </th>
                    {SET_IDS.map((id) => {
                      const error = errors[`${id}-${i}`]
                      const inputId = `dist-${id}-${i}`
                      return (
                        <td key={id} className="border-b border-border px-2 py-2">
                          <label htmlFor={inputId} className="sr-only">
                            ระยะทาง {SET_INFO[id].title} ความเข้มข้น {conc.toFixed(1)} M (มิลลิเมตร)
                          </label>
                          <input
                            id={inputId}
                            type="text"
                            inputMode="decimal"
                            autoComplete="off"
                            placeholder="—"
                            value={inputs[id][i]}
                            onChange={(e) => updateCell(id, i, e.target.value)}
                            aria-invalid={error ? true : undefined}
                            className={cn(
                              'h-10 w-full min-w-20 rounded-lg border bg-background px-3 font-mono text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring',
                              error ? 'border-destructive bg-destructive/15 text-destructive' : 'border-input',
                            )}
                          />
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {errorEntries.length > 0 && (
            <Notice tone="warning">
              <p className="font-semibold">ข้อมูลยังไม่ถูกต้อง ไม่สามารถพล็อตกราฟได้</p>
              <ul className="mt-1 list-inside list-disc text-destructive/85">
                {counts.missing > 0 && <li>ยังไม่ได้กรอกข้อมูล {counts.missing} ช่อง</li>}
                {counts.invalid > 0 && <li>กรอกค่าที่ไม่ใช่ตัวเลขหรือติดลบ {counts.invalid} ช่อง</li>}
                {counts.off > 0 && (
                  <li>ค่าระยะทางคลาดเคลื่อนเกิน ±1 mm จากผลการทดลองจริง {counts.off} ช่อง — กลับไปวัดใหม่ด้วยไม้บรรทัด</li>
                )}
              </ul>
            </Notice>
          )}

          <div className="flex flex-wrap gap-2">
            <Button size="lg" onClick={plotGraph}>
              <ChartLine aria-hidden="true" />
              Plot Graph
            </Button>
            <Button size="lg" variant="secondary" onClick={() => setShowLookback((v) => !v)} aria-expanded={showLookback}>
              <Ruler aria-hidden="true" />
              {showLookback ? 'ซ่อนผลขั้นตอนที่ 3' : 'ย้อนดูผลขั้นตอนที่ 3'}
            </Button>
            <Button size="lg" variant="outline" onClick={resetTable}>
              <RotateCcw aria-hidden="true" />
              ล้างตาราง
            </Button>
          </div>
        </Panel>

        <Panel className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-foreground">กราฟความเข้มข้น vs ระยะทางการเคลื่อนที่</h3>
          {plotted ? (
            <>
              <DistanceChart values={plotted} />
              <Notice tone="success">
                พล็อตกราฟสำเร็จ! นำข้อมูลไปวิเคราะห์ความสัมพันธ์ต่อในใบงานของนักเรียน
              </Notice>
            </>
          ) : (
            <div className="flex h-80 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/50 p-6 text-center md:h-96">
              <ChartLine className="size-10 text-muted-foreground" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">กรอกข้อมูลให้ครบและถูกต้อง แล้วกด Plot Graph เพื่อแสดงกราฟ</p>
            </div>
          )}
        </Panel>
      </div>

      {showLookback && (
        <Panel className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div role="tablist" aria-label="เลือกชุดที่จะย้อนดู" className="flex gap-2">
              {SET_IDS.map((id) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={lookbackSet === id}
                  onClick={() => setLookbackSet(id)}
                  className={cn(
                    'rounded-lg border px-3 py-1.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-ring',
                    lookbackSet === id ? 'border-primary bg-primary/10 text-foreground' : 'border-border text-muted-foreground hover:border-primary/60',
                  )}
                >
                  {SET_INFO[id].title}
                </button>
              ))}
            </div>
            <Button variant={showHint ? 'destructive' : 'outline'} onClick={() => setShowHint((v) => !v)} aria-pressed={showHint}>
              {showHint ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
              {showHint ? 'ซ่อนตำแหน่งที่ถูกต้อง' : 'แสดงตำแหน่งที่ถูกต้องบนไม้บรรทัด (สีแดง)'}
            </Button>
          </div>
          <TestBench key={lookbackSet} set={lookbackSet} tested={Array(5).fill(true)} distances={distances[lookbackSet]} showHint={showHint} />
          <p className="text-xs text-muted-foreground">ลากไม้บรรทัดไปวางข้างแถบกระดาษเพื่อวัดซ้ำ เส้นสีแดงบนไม้บรรทัดคือตำแหน่งขอบสีที่ถูกต้องของแต่ละความเข้มข้น</p>
        </Panel>
      )}
    </div>
  )
}
