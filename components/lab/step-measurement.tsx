'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { CONCENTRATIONS, type SetId } from '@/lib/lab'
import { Notice, Panel, StepHeading } from './lab-ui'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { CheckCircle2, RotateCcw, TrendingUp } from 'lucide-react'

type StepMeasurementProps = {
  distances: Record<SetId, number[]>
  onComplete: () => void
}

export function StepMeasurement({ distances, onComplete }: StepMeasurementProps) {
  // โหลดข้อมูลตารางและสถานะกราฟจาก sessionStorage ถ้ามี
  const [inputs, setInputs] = useState<Record<SetId, Record<number, string>>>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('lab_measurement_inputs')
      if (saved) {
        try { return JSON.parse(saved) } catch (e) { /* ignore */ }
      }
    }
    return { A: {}, B: {} }
  })

  const [hasPlotted, setHasPlotted] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('lab_measurement_plotted')
      if (saved) {
        try { return JSON.parse(saved) } catch (e) { /* ignore */ }
      }
    }
    return false
  })

  const [error, setError] = useState<string | null>(null)

  // บันทึกลง sessionStorage ทุกครั้งที่มีการเปลี่ยนแปลง
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('lab_measurement_inputs', JSON.stringify(inputs))
      sessionStorage.setItem('lab_measurement_plotted', JSON.stringify(hasPlotted))
    }
  }, [inputs, hasPlotted])

  const handleInputChange = (set: SetId, conc: number, value: string) => {
    setInputs((prev) => ({
      ...prev,
      [set]: {
        ...prev[set],
        [conc]: value,
      },
    }))
    setError(null)
  }

  const handlePlotGraph = () => {
    // ตรวจสอบว่ากรอกครบทุกช่องหรือไม่
    for (const conc of CONCENTRATIONS) {
      if (!inputs.A[conc] || !inputs.B[conc]) {
        setError('กรุณากรอกระยะการเคลื่อนที่ให้ครบทุกช่องก่อนพล็อตกราฟ')
        return
      }
    }
    setHasPlotted(true)
    onComplete()
  }

  const handleReset = () => {
    setInputs({ A: {}, B: {} })
    setHasPlotted(false)
    setError(null)
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('lab_measurement_inputs')
      sessionStorage.removeItem('lab_measurement_plotted')
    }
  }

  // เตรียมข้อมูลสำหรับ Recharts
  const chartData = CONCENTRATIONS.map((conc) => ({
    concentration: conc,
    setA: Number(inputs.A[conc]) || 0,
    setB: Number(inputs.B[conc]) || 0,
  }))

  return (
    <div className="flex flex-col gap-6">
      <StepHeading
        step={4}
        title="บันทึกผล & พล็อตกราฟ (Measurement & Graph)"
        subtitle="กรอกระยะการเคลื่อนที่ (mm) ที่วัดได้จากขั้นตอนที่ 3 ลงในตาราง แล้วกด Plot Graph เพื่อสร้างกราฟความสัมพันธ์ระหว่างความเข้มข้นกับระยะทาง"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ตารางบันทึกผลการทดลอง */}
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
                {CONCENTRATIONS.map((conc) => (
                  <tr key={conc}>
                    <td className="py-3 font-mono font-semibold text-foreground">{conc}</td>
                    <td className="py-3 pr-2">
                      <input
                        type="number"
                        step="0.1"
                        value={inputs.A[conc] ?? ''}
                        onChange={(e) => handleInputChange('A', conc, e.target.value)}
                        placeholder="ระบุตัวเลข"
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.5 font-mono text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </td>
                    <td className="py-3 pl-2">
                      <input
                        type="number"
                        step="0.1"
                        value={inputs.B[conc] ?? ''}
                        onChange={(e) => handleInputChange('B', conc, e.target.value)}
                        placeholder="ระบุตัวเลข"
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.5 font-mono text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {error && <p className="text-xs font-medium text-destructive">{error}</p>}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button onClick={handlePlotGraph} className="gap-2 bg-amber-600 text-white hover:bg-amber-700">
              <TrendingUp className="size-4" /> Plot Graph
            </Button>
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RotateCcw className="size-4" /> ล้างตาราง
            </Button>
          </div>
        </Panel>

        {/* กราฟแสดงผล */}
        <Panel className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-foreground">กราฟความเข้มข้น vs ระยะทางการเคลื่อนที่</h3>
          
          <div className="flex h-80 w-full items-center justify-center rounded-xl border border-border bg-background/50 p-4">
            {hasPlotted ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="concentration" stroke="#94a3b8" fontSize={12} label={{ value: 'Concentration (M)', position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis stroke="#94a3b8" fontSize={12} label={{ value: 'Distance (mm)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="setA" name="Set A (กระดาษแดง)" stroke="#ff1a1a" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="setB" name="Set B (กระดาษเหลือง)" stroke="#f2c230" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground">
                <TrendingUp className="mb-2 size-10 opacity-40" />
                <p className="text-sm">กรอกข้อมูลให้ครบและถูกต้อง แล้วกด Plot Graph เพื่อแสดงกราฟ</p>
              </div>
            )}
          </div>

          {hasPlotted && (
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
