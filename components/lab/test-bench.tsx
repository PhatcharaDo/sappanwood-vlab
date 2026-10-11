'use client'

import { type KeyboardEvent, type PointerEvent, useRef, useState } from 'react'
import { CONCENTRATIONS, mixHex, PX_PER_MM, SET_INFO, type SetId, STRIP_LENGTH_MM } from '@/lib/lab'
import { cn } from '@/lib/utils'

const TOP = 28
const STRIP_H = STRIP_LENGTH_MM * PX_PER_MM
const BASE = TOP + STRIP_H
const BENCH_H = BASE + 52
const STRIP_W = 28
const STRIP_X0 = 112
const STRIP_GAP = 84
const BENCH_W = STRIP_X0 + STRIP_GAP * 4 + STRIP_W + 100
const RULER_MM = 65
const RULER_H = RULER_MM * PX_PER_MM
const RULER_W = 52

export function reactedColor(set: SetId, index: number) {
  const info = SET_INFO[set]
  return mixHex(info.paperColor, info.reactedColor, 0.55 + index * 0.1)
}

type TestBenchProps = {
  set: SetId
  tested: boolean[]
  distances: number[]
  animateIndex?: number | null
  onStripClick?: (index: number) => void
  showHint?: boolean
  selectedIndex?: number | null
}

export function TestBench({ set, tested, distances, animateIndex = null, onStripClick, showHint = false, selectedIndex = null }: TestBenchProps) {
  const info = SET_INFO[set]
  const benchRef = useRef<HTMLDivElement>(null)
  const dragOffset = useRef<number | null>(null)
  const [rulerX, setRulerX] = useState(28)
  const [cursorMm, setCursorMm] = useState<number | null>(null)

  const clampX = (x: number) => Math.max(0, Math.min(BENCH_W - RULER_W, x))

  function handleRulerDown(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId)
    const rect = benchRef.current?.getBoundingClientRect()
    if (!rect) return
    dragOffset.current = event.clientX - rect.left - rulerX
  }

  function handleRulerMove(event: PointerEvent<HTMLDivElement>) {
    if (dragOffset.current === null) return
    const rect = benchRef.current?.getBoundingClientRect()
    if (!rect) return
    setRulerX(clampX(event.clientX - rect.left - dragOffset.current))
  }

  function handleRulerKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight') setRulerX((x) => clampX(x + 8))
    if (event.key === 'ArrowLeft') setRulerX((x) => clampX(x - 8))
  }

  function handleBenchMove(event: PointerEvent<HTMLDivElement>) {
    const rect = benchRef.current?.getBoundingClientRect()
    if (!rect) return
    const mm = (BASE - (event.clientY - rect.top)) / PX_PER_MM
    setCursorMm(mm >= 0 && mm <= RULER_MM ? Math.round(mm) : null)
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-[#0d1f38] pb-2">
      <div
        ref={benchRef}
        className="relative mx-auto touch-none select-none"
        style={{ width: BENCH_W, height: BENCH_H, minWidth: BENCH_W }}
        onPointerMove={handleBenchMove}
        onPointerLeave={() => setCursorMm(null)}
      >
        <div
          className="absolute inset-x-0 border-t border-dashed border-primary/50"
          style={{ top: BASE }}
          aria-hidden="true"
        />
        <span className="absolute right-2 font-mono text-[10px] text-primary/80" style={{ top: BASE + 2 }} aria-hidden="true">
          จุดหยด (0 mm)
        </span>

        {CONCENTRATIONS.map((conc, i) => {
          const left = STRIP_X0 + i * STRIP_GAP
          const migrated = tested[i] ? distances[i] * PX_PER_MM : 0
          const label = `แถบที่ ${i + 1} สำหรับ ${info.testReagent} ${conc.toFixed(1)} M${tested[i] ? ' (หยดแล้ว)' : ''}`
          const content = (
            <>
              {tested[i] && (
                <span
                  key={animateIndex === i ? 'animating' : 'static'}
                  className={cn('absolute inset-x-0 bottom-0', animateIndex === i && 'animate-migrate')}
                  style={{
                    height: migrated,
                    background: `linear-gradient(to top, ${reactedColor(set, i)} 0%, ${reactedColor(set, i)} 88%, ${mixHex(reactedColor(set, i), info.paperColor, 0.5)} 100%)`,
                  }}
                />
              )}
              <span className="absolute bottom-1 left-1/2 size-2.5 -translate-x-1/2 rounded-full border border-white/50 bg-white/20" />
            </>
          )
          const common = cn(
            'absolute overflow-hidden rounded-[3px] shadow-md',
            selectedIndex === i && !tested[i] && 'ring-2 ring-primary ring-offset-2 ring-offset-[#0d1f38]',
          )
          const style = { left, top: TOP, width: STRIP_W, height: STRIP_H, backgroundColor: info.paperColor }
          return (
            <div key={conc}>
              {onStripClick ? (
                <button
                  type="button"
                  aria-label={label}
                  onClick={() => onStripClick(i)}
                  className={cn(common, 'cursor-pointer hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring')}
                  style={style}
                >
                  {content}
                </button>
              ) : (
                <div role="img" aria-label={label} className={common} style={style}>
                  {content}
                </div>
              )}
              {animateIndex === i && (
                <span
                  key={`drop-${animateIndex}`}
                  className="animate-drop-fall pointer-events-none absolute size-3 rounded-full rounded-tl-none bg-sky-200"
                  style={{ left: left + STRIP_W / 2 - 6, top: BASE - 14 }}
                  aria-hidden="true"
                />
              )}
              <span
                className="pointer-events-none absolute flex flex-col items-center text-center leading-tight"
                style={{ left: left - 22, width: STRIP_W + 44, top: BASE + 14 }}
              >
                <span className="text-[11px] text-muted-foreground">แถบ {i + 1}</span>
                <span className={cn('font-mono text-xs font-semibold', tested[i] ? 'text-success' : 'text-foreground')}>
                  {conc.toFixed(1)} M
                </span>
              </span>
            </div>
          )
        })}

        {cursorMm !== null && (
          <div
            className="pointer-events-none absolute inset-x-0 border-t border-sky-300/70"
            style={{ top: BASE - cursorMm * PX_PER_MM }}
            aria-hidden="true"
          >
            <span className="absolute -top-5 right-2 rounded bg-sky-300 px-1.5 font-mono text-[10px] font-semibold text-slate-900">
              {cursorMm} mm
            </span>
          </div>
        )}

        <div
          role="slider"
          tabIndex={0}
          aria-label="ไม้บรรทัดเสมือน (ลากหรือกดลูกศรซ้าย/ขวาเพื่อเลื่อน)"
          aria-valuemin={0}
          aria-valuemax={BENCH_W - RULER_W}
          aria-valuenow={Math.round(rulerX)}
          onPointerDown={handleRulerDown}
          onPointerMove={handleRulerMove}
          onPointerUp={() => (dragOffset.current = null)}
          onKeyDown={handleRulerKey}
          className="absolute cursor-grab rounded-sm shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:cursor-grabbing"
          style={{ left: rulerX, top: BASE - RULER_H, width: RULER_W, height: RULER_H + 6 }}
        >
          <svg width={RULER_W} height={RULER_H + 6} aria-hidden="true" className="block">
            <rect x="0" y="0" width={RULER_W} height={RULER_H + 6} rx="3" fill="#f3e3b3" opacity="0.94" />
            {Array.from({ length: RULER_MM + 1 }, (_, mm) => {
              const y = RULER_H - mm * PX_PER_MM
              const len = mm % 10 === 0 ? 18 : mm % 5 === 0 ? 12 : 6
              return (
                <g key={mm}>
                  <line x1={RULER_W - len} x2={RULER_W} y1={y} y2={y} stroke="#1e293b" strokeWidth={mm % 10 === 0 ? 1.4 : 0.8} />
                  {mm % 10 === 0 && (
                    <text x={RULER_W - 21} y={y + 3} fontSize="9" textAnchor="end" fill="#1e293b" fontFamily="monospace">
                      {mm}
                    </text>
                  )}
                </g>
              )
            })}
            <text x="4" y="10" fontSize="8" fill="#475569" fontFamily="monospace">
              mm
            </text>
            {showHint &&
              distances.map((mm, i) => {
                const y = RULER_H - mm * PX_PER_MM
                return (
                  <g key={`hint-${mm}`}>
                    <line x1="0" x2={RULER_W} y1={y} y2={y} stroke="#dc2626" strokeWidth="2" />
                    <text x="3" y={y - 2} fontSize="7" fill="#dc2626" fontWeight="700" fontFamily="monospace">
                      {CONCENTRATIONS[i].toFixed(1)}M
                    </text>
                  </g>
                )
              })}
          </svg>
        </div>
      </div>
    </div>
  )
}
