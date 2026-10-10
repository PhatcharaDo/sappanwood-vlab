'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export function useTimedProgress(durationMs: number, onDone?: () => void) {
  const [progress, setProgress] = useState(0)
  const [running, setRunning] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const onDoneRef = useRef(onDone)

  useEffect(() => {
    onDoneRef.current = onDone
  }, [onDone])

  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current)
    },
    [],
  )

  const start = useCallback(() => {
    if (timer.current) return
    const startedAt = Date.now()
    setRunning(true)
    timer.current = setInterval(() => {
      const next = Math.min(1, (Date.now() - startedAt) / durationMs)
      setProgress(next)
      if (next >= 1 && timer.current) {
        clearInterval(timer.current)
        timer.current = null
        setRunning(false)
        onDoneRef.current?.()
      }
    }, 50)
  }, [durationMs])

  const reset = useCallback(() => {
    if (timer.current) clearInterval(timer.current)
    timer.current = null
    setRunning(false)
    setProgress(0)
  }, [])

  return { progress, running, start, reset, setProgress }
}
