import { useCallback, useEffect, useRef, useState } from 'react'

import { LINE_UPDATE_INTERVAL } from '@/constants/app'

export const useCountdown = (from: number, duration: number = LINE_UPDATE_INTERVAL) => {
  const [remaining, setCount] = useState(0)
  const _from = useRef(from)

  const update = useCallback(() => {
    setCount(() => {
      const diff = Date.now() - _from.current
      return Math.max(0, Math.floor((duration - diff) / 1000))
    })
  }, [duration])

  useEffect(() => {
    update()

    const interval = setInterval(update, 1_000)
    return () => clearInterval(interval)
  }, [update])

  useEffect(() => {
    if (from !== _from.current) {
      _from.current = from
    }
  }, [from])

  return {
    remaining,
  }
}
