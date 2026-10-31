import { useState, type ReactNode } from 'react'

import { BottomTabHeightContext } from '@/composables/useBottomTabHeight'

export const BottomTabHeightProvider = ({ children }: { children: ReactNode }) => {
  const [height, setHeight] = useState(0)

  return <BottomTabHeightContext value={{ height, setHeight }}>{children}</BottomTabHeightContext>
}
