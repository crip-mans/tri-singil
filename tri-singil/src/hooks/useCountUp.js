import { useEffect, useRef, useState } from 'react'

// Animates from the previous numeric value to the next over `duration` ms,
// used for the fare total's brief count-up when it's recalculated.
export function useCountUp(value, duration = 500) {
  const [display, setDisplay] = useState(value ?? 0)
  const fromRef = useRef(value ?? 0)

  useEffect(() => {
    if (value == null) return

    const from = fromRef.current
    const to = value
    if (from === to) {
      setDisplay(to)
      return
    }

    const start = performance.now()
    let frame

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - progress) * (1 - progress)
      setDisplay(Math.round(from + (to - from) * eased))
      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      } else {
        fromRef.current = to
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, duration])

  return display
}
