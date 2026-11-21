import { useCallback, useEffect } from 'react'

import type { Padding } from '@/components/provider/MapProvider'
import type { OnLayoutFunction } from '@/types/shared'

import { useMap } from './useMap'

export const useMapPadding = (id: string, edge: keyof Padding) => {
  const { registerPadding, unRegisterPadding } = useMap()

  const onLayout = useCallback<OnLayoutFunction>(
    (event) => {
      const { width, height } = event.nativeEvent.layout

      const value = edge === 'top' || edge === 'bottom' ? height : width

      registerPadding(id, edge, value)
    },
    [id, edge, registerPadding],
  )

  useEffect(() => () => unRegisterPadding(id), [id, unRegisterPadding])

  return { onLayout }
}
