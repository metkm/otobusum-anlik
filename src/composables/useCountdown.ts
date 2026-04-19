import { useCallback, useEffect, useRef, useState } from 'react'

import { lineUpdateInterval } from '@/constants/app'

export const useCountdown = (from: number = Date.now(), duration: number = lineUpdateInterval) => {
  const [count, setCount] = useState(0)
  const _from = useRef(from)

  const loop = useCallback(() => {
    setCount(() => {
      const diff = Date.now() - _from.current
      return Math.max(0, duration - diff)
    })

    return setTimeout(loop, 1_000)
  }, [duration])

  useEffect(() => {
    let listener = loop()
    return () => {
      clearTimeout(listener)
    }
  }, [loop])

  useEffect(() => {
    if (from !== _from.current) {
      _from.current = from
    }
  }, [from])

  return {
    count,
  }
}
