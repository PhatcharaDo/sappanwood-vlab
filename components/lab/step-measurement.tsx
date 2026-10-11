'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { CONCENTRATIONS, type SetId } from '@/lib/lab'
import { Notice, Panel, StepHeading } from './lab-ui'
import { CheckCircle2, RotateCcw, TrendingUp } from 'lucide-react'

type StepMeasurementProps = {
  distances: Record<SetId, number[]>
  onComplete: () => void
}

export function StepMeasurement({ distances, onComplete }: StepMeasurementProps) {
  // บันทึกสถานะการพล็อตกราฟลงใน sessionStorage เพื่อไม่ให้หายเวลากลับมาจากหน้าครัวเรือน
  const [graphed, setGraphed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('lab_graphed_state')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          /* ignore */
        }
      }
    }
    return false
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('lab_graphed_state', JSON.stringify(graphed))
    }
  }, [graphed])

  const handlePlot = () => {
    setGraphed(true)
    onComplete()
  }

  const handleReset = () => {
    setGraphed(false)
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('lab_graphed_state')
    }
  }

  // คำนวณพิกัดสำหรับ SVG Graph ตามค่า distances ที่ส่งมา
  const pointsA = distances.A.map((val, idx) => {
    const x = 40 + idx * 60
    const y = 220 - Math.min(val * 4, 180)
    return `${x},${y}`
  }).join(' ')

  const pointsB = distances.B.map((val, idx) => {
    const x = 40 + idx * 60
    const y = 220 - Math.min(val * 4, 180)
    return `${x},${y}`
  }).join(' ')

  return (
    <div className="flex flex-col gap-6">
      <StepHeading
        step={4}
        title="บันทึกผล & พล็อตกราฟ (Measurement & Graph)"
        subtitle="บันทึกและแสดงผลระยะการเคลื่อนที่ (mm) จากการทดลองในขั้นตอนที่ 3 เพื่อสร้างกราฟความสัมพันธ์"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ตารางแสดงผลการทดลองจากขั้นตอนที่ 3 */}
        <Panel className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-foreground">ตารางบันทึกผลการทดลอง</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="pb-3 font-semibold">ความเข้มข้น (M)</th>
                  <th className="pb-3 font-semibold text-[#ff1a1a]">Set A (mm)</th>
                  <th className="pb-3 font-semibold text-[#f2c230]">Set B (mm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {CONCENTRATIONS.map((conc, idx) => (
                  <tr key={conc}>
                    <td className="py-3 font-mono font-semibold text-foreground">{conc}</td>
                    <td className="py-3 font-mono font-medium text-[#ff1a1a]">{distances.A[idx]} mm</td>
                    <td className="py-3 font-mono font-medium text-[#f2c230]">{distances.B[idx]} mm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button onClick={handlePlot} className="gap-2 bg-amber-600 text-white hover:bg-amber-700">
              <TrendingUp className="size-4" /> Plot Graph
            </Button>
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RotateCcw className="size-4" /> ล้างกราฟ
            </Button>
          </div>
        </Panel>

        {/* กราฟแสดงผล */}
        <Panel className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-foreground">กราฟความเข้มข้น vs ระยะทางการเคลื่อนที่</h3>

          <div className="flex h-80 w-full items-center justify-center rounded-xl border border-border bg-background/50 p-4">
            {graphed ? (
              <div className="relative h-full w-full">
                <svg viewBox="0 0 320 250" className="h-full w-full overflow-visible">
                  {/* เส้น Grid */}
                  <line x1="30" y1="220" x2="300" y2="220" stroke="#334155" strokeWidth="1" />
                  <line x1="30" y1="30" x2="30" y2="220" stroke="#334155" strokeWidth="1" />

                  {/* เส้นกราฟ Set A */}
                  <polyline fill="none" stroke="#ff1a1a" strokeWidth="2.5" points={pointsA} />
                  {distances.A.map((val, idx) => {
                    const x = 40 + idx * 60
                    const y = 220 - Math.min(val * 4, 180)
                    return <circle key={`a-${idx}`} cx={x} cy={y} r="4" fill="#ff1a1a" />
                  })}

                  {/* เส้นกราฟ Set B */}
                  <polyline fill="none" stroke="#f2c230" strokeWidth="2.5" points={pointsB} />
                  {distances.B.map((val, idx) => {
                    const x = 40 + idx * 60
                    const y = 220 - Math.min(val * 4, 180)
                    return <circle key={`b-${idx}`} cx={x} cy={y} r="4" fill="#f2c230" />
                  })}

                  {/* แกน X Label */}
                  {CONCENTRATIONS.map((conc, idx) => (
                    <text key={`x-${idx}`} x={40 + idx * 60} y="240" fill="#94a3b8" fontSize="10" textAnchor="middle">
                      {conc}M
                    </text>
                  ))}
                </svg>

                {/* Legend */}
                <div className="absolute right-2 top-2 flex items-center gap-4 rounded-lg bg-card/80 p-2 text-xs border border-border">
                  <div className="flex items-center gap-1.5">
                    <div className="size-2.5 rounded-full bg-[#ff1a1a]" />
                    <span className="text-muted-foreground">Set A</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="size-2.5 rounded-full bg-[#f2c230]" />
                    <span className="text-muted-foreground">Set B</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground">
                <TrendingUp className="mb-2 size-10 opacity-40" />
                <p className="text-sm">กด Plot Graph เพื่อแสดงกราฟความสัมพันธ์</p>
              </div>
            )}
          </div>

          {graphed && (
            <Notice tone="success" className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-green-500" />
              <span>พล็อตกราฟสำเร็จ! คุณสามารถไปทำภารกิจพิเศษสารในครัวเรือนต่อได้เลย</span>
            </Notice>
          )}
        </Panel>
      </div>
    </div>
  )
}
