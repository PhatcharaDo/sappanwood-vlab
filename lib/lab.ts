export type SetId = 'A' | 'B'

export const SET_IDS: SetId[] = ['A', 'B']

export const CONCENTRATIONS = [0.1, 0.2, 0.3, 0.4, 0.5] as const

export const STRIP_LENGTH_MM = 60
export const PX_PER_MM = 4
export const TOLERANCE_MM = 1

/** Simulated migration distances (mm) for each concentration, 0.1 M to 0.5 M. */
export const EXPECTED_DISTANCE: Record<SetId, number[]> = {
  A: [11, 18, 26, 33, 41],
  B: [9, 15, 22, 28, 35],
}

export const EXTRACT_COLOR = '#d9480f'

export const SET_INFO: Record<
  SetId,
  {
    title: string
    purpose: string
    paperName: string
    paperColor: string
    reactedColor: string
    mixReagent: string
    testReagent: string
    testFormula: string
    overshootColor: string
  }
> = {
  A: {
    title: 'Set A',
    purpose: 'ทดสอบกรด (Acid Testing)',
    paperName: 'กระดาษสีแดง',
    paperColor: '#c8102e',
    reactedColor: '#f6b319',
    mixReagent: 'เบส (NaOH)',
    testReagent: 'กรด',
    testFormula: 'HCl',
    overshootColor: '#6b1d5c',
  },
  B: {
    title: 'Set B',
    purpose: 'ทดสอบเบส (Base Testing)',
    paperName: 'กระดาษสีเหลือง',
    paperColor: '#f2c230',
    reactedColor: '#8e1b5b',
    mixReagent: 'กรด (HCl)',
    testReagent: 'เบส',
    testFormula: 'NaOH',
    overshootColor: '#fbe7a1',
  },
}

export function mixHex(from: string, to: string, t: number) {
  const clamp = Math.min(1, Math.max(0, t))
  const parse = (hex: string) => [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16))
  const a = parse(from)
  const b = parse(to)
  const mixed = a.map((v, i) => Math.round(v + (b[i] - v) * clamp))
  return `#${mixed.map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

export function formatClock(totalSeconds: number) {
  const s = Math.max(0, Math.ceil(totalSeconds))
  const m = Math.floor(s / 60)
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}
