import { useId } from 'react'
import { cn } from '@/lib/utils'

type BeakerProps = {
  level: number
  color: string
  powder?: boolean
  rod?: boolean
  stirring?: boolean
  capacityLabel?: string
  className?: string
  title: string
}

const GLASS = 'rgba(214, 228, 245, 0.75)'

export function BeakerGraphic({
  level,
  color,
  powder = false,
  rod = false,
  stirring = false,
  capacityLabel = '100 mL',
  className,
  title,
}: BeakerProps) {
  const clipId = useId()
  const liquidHeight = Math.max(0, Math.min(1, level)) * 150
  const marks = [20, 40, 60, 80, 100]

  return (
    <svg viewBox="0 0 160 190" role="img" aria-label={title} className={cn('h-auto w-full', className)}>
      <defs>
        <clipPath id={clipId}>
          <path d="M32 20 L32 165 Q32 176 43 176 L117 176 Q128 176 128 165 L128 20 Z" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        <rect
          x="30"
          y={176 - liquidHeight}
          width="100"
          height={liquidHeight}
          fill={color}
          opacity="0.9"
          style={{ transition: 'y 0.4s ease, height 0.4s ease, fill 0.6s ease' }}
        />
        {liquidHeight > 0 && (
          <rect x="30" y={176 - liquidHeight} width="100" height="3" fill="#ffffff" opacity="0.25" />
        )}
        {powder && (
          <g className={cn(stirring && 'animate-pulse')}>
            <rect x="30" y="164" width="100" height="14" fill="#7a3e1d" />
            {[40, 52, 63, 75, 88, 99, 110, 120].map((x, i) => (
              <circle key={x} cx={x} cy={i % 2 ? 167 : 171} r="2" fill="#a0582c" />
            ))}
          </g>
        )}
      </g>

      {marks.map((mL) => {
        const y = 176 - (mL / 100) * 150
        return (
          <g key={mL}>
            <line x1="112" x2="128" y1={y} y2={y} stroke={GLASS} strokeWidth="1.2" />
            <text x="108" y={y + 3} fontSize="8" textAnchor="end" fill="#9fb0c8" fontFamily="monospace">
              {mL}
            </text>
          </g>
        )
      })}

      <path
        d="M24 16 L30 22 L30 165 Q30 178 43 178 L117 178 Q130 178 130 165 L130 20"
        fill="none"
        stroke={GLASS}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <text x="80" y="12" fontSize="9" textAnchor="middle" fill="#9fb0c8">
        {capacityLabel}
      </text>

      {rod && (
        <g
          className={cn(stirring && 'animate-stir')}
          style={{ transformOrigin: '96px 4px', transformBox: 'view-box' }}
        >
          <line x1="104" y1="0" x2="72" y2="170" stroke="#e8f1fb" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
        </g>
      )}
    </svg>
  )
}

type FilterProps = {
  funnelLevel: number
  flaskLevel: number
  color: string
  dripping: boolean
  title: string
  className?: string
}

export function FilterSetupGraphic({ funnelLevel, flaskLevel, color, dripping, title, className }: FilterProps) {
  const coneId = useId()
  const flaskId = useId()
  const funnelHeight = Math.max(0, Math.min(1, funnelLevel)) * 56
  const flaskHeight = Math.max(0, Math.min(1, flaskLevel)) * 52

  return (
    <svg viewBox="0 0 160 260" role="img" aria-label={title} className={cn('h-auto w-full', className)}>
      <defs>
        <clipPath id={coneId}>
          <path d="M38 24 L122 24 L80 88 Z" />
        </clipPath>
        <clipPath id={flaskId}>
          <path d="M70 150 L70 183 L32 240 Q29 246 37 246 L123 246 Q131 246 128 240 L90 183 L90 150 Z" />
        </clipPath>
      </defs>

      <path d="M38 24 L122 24 L80 88 Z" fill="#f8fafc" opacity="0.92" />
      <g clipPath={`url(#${coneId})`}>
        <rect
          x="30"
          y={88 - funnelHeight}
          width="100"
          height={funnelHeight}
          fill={color}
          style={{ transition: 'y 0.3s linear, height 0.3s linear' }}
        />
      </g>
      <path
        d="M28 20 L132 20 L88 90 L88 132 L72 132 L72 90 Z"
        fill="none"
        stroke={GLASS}
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {dripping && (
        <g>
          <circle cx="80" cy="138" r="3.2" fill={color} className="animate-drip" />
          <circle cx="80" cy="138" r="3.2" fill={color} className="animate-drip" style={{ animationDelay: '0.45s' }} />
        </g>
      )}

      <g clipPath={`url(#${flaskId})`}>
        <rect
          x="20"
          y={246 - flaskHeight}
          width="120"
          height={flaskHeight}
          fill={color}
          opacity="0.92"
          style={{ transition: 'y 0.3s linear, height 0.3s linear' }}
        />
      </g>
      <path
        d="M66 148 L70 150 L70 183 L32 240 Q27 248 38 248 L122 248 Q133 248 128 240 L90 183 L90 150 L94 148"
        fill="none"
        stroke={GLASS}
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type PetriDishProps = {
  colors: string[]
  label: string
}

export function PetriDish({ colors, label }: PetriDishProps) {
  return (
    <figure className="flex flex-col items-center gap-2">
      <div
        role="img"
        aria-label={label}
        className="flex size-44 items-center justify-center gap-2.5 rounded-full border-4 border-[rgba(214,228,245,0.55)] bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.18),rgba(255,255,255,0.03)_60%)] shadow-[inset_0_0_0_6px_rgba(214,228,245,0.12)]"
      >
        {colors.map((color, i) => (
          <span
            key={i}
            className="h-24 w-4 rounded-sm shadow-sm"
            style={{ backgroundColor: color, transform: `rotate(${(i - 2) * 4}deg)` }}
          />
        ))}
      </div>
      <figcaption className="text-xs text-muted-foreground">{label}</figcaption>
    </figure>
  )
}
