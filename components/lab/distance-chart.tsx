'use client'

import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Tooltip } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { CONCENTRATIONS, SET_INFO, type SetId } from '@/lib/lab'

ChartJS.register(LinearScale, CategoryScale, PointElement, LineElement, Tooltip, Legend)

const GRID = 'rgba(159, 176, 200, 0.15)'
const TICK = '#9fb0c8'
const LINE_COLORS: Record<SetId, string> = { A: '#f87171', B: '#facc15' }

export function DistanceChart({ values }: { values: Record<SetId, number[]> }) {
  // Canvas text ignores CSS, so hand Chart.js the page's resolved Thai font stack.
  if (typeof document !== 'undefined') {
    ChartJS.defaults.font.family = getComputedStyle(document.body).fontFamily
  }

  const datasets = (Object.keys(values) as SetId[]).map((id) => ({
    label: `${SET_INFO[id].title} · ${SET_INFO[id].purpose}`,
    data: CONCENTRATIONS.map((c, i) => ({ x: c, y: values[id][i] })),
    borderColor: LINE_COLORS[id],
    backgroundColor: LINE_COLORS[id],
    pointRadius: 5,
    pointHoverRadius: 7,
    borderWidth: 2.5,
    tension: 0,
  }))

  return (
    <div className="h-80 w-full md:h-96">
      <Line
        aria-label="กราฟความสัมพันธ์ระหว่างความเข้มข้น (M) กับระยะทางการเคลื่อนที่ (mm)"
        role="img"
        data={{ datasets }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          parsing: false,
          plugins: {
            legend: { labels: { color: '#e6edf7', usePointStyle: true, padding: 16 } },
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y} mm @ ${ctx.parsed.x} M`,
              },
            },
          },
          scales: {
            x: {
              type: 'linear',
              min: 0,
              max: 0.6,
              ticks: { stepSize: 0.1, color: TICK },
              grid: { color: GRID },
              title: { display: true, text: 'ความเข้มข้น (mol/dm³)', color: '#e6edf7' },
            },
            y: {
              min: 0,
              suggestedMax: 50,
              ticks: { color: TICK },
              grid: { color: GRID },
              title: { display: true, text: 'ระยะทางการเคลื่อนที่ (mm)', color: '#e6edf7' },
            },
          },
        }}
      />
    </div>
  )
}
