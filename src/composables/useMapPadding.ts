import { useCallback, useEffect, useId } from 'react'
import type { LayoutChangeEvent } from 'react-native'

import type { Padding } from '@/components/MapProvider'

import { useMap } from './useMap'

export const useMapPadding = (edge: keyof Padding) => {
  const id = useId()
  const { registerPadding, unRegisterPadding } = useMap()

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout

      const value = edge === 'top' || edge === 'bottom' ? height : width

      registerPadding(id, edge, value)
    },
    [id, edge, registerPadding],
  )

  useEffect(() => () => unRegisterPadding(id), [id, unRegisterPadding])

  return { onLayout }
}
