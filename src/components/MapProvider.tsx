import type { CameraRef, MapRef } from '@maplibre/maplibre-react-native'
import { useCallback, useMemo, useRef } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { MapContext, type MapContextInstance } from '@/composables/useMap'

export interface Padding {
  top: number
  right: number
  bottom: number
  left: number
}

interface PaddingContribution {
  id: string
  edge: keyof Padding
  value: number
}

export const MapProvider = ({ children }: { children: React.ReactNode }) => {
  const map = useRef<MapRef>(null)
  const camera = useRef<CameraRef>(null)
  const paddingRef = useRef(new Map<string, PaddingContribution>())
  const insets = useSafeAreaInsets()

  const registerPadding = useCallback(
    (id: string, edge: keyof Padding, value: number) => {
      paddingRef.current.set(id, {
        edge,
        id,
        value,
      })
    },
    [paddingRef],
  )

  const unRegisterPadding = useCallback(
    (id: string) => {
      paddingRef.current.delete(id)
    },
    [paddingRef],
  )

  const getPadding = useCallback(() => {
    const result: Padding = {
      bottom: 25,
      left: insets.left + 25,
      right: insets.right + 25,
      top: insets.top + 25,
    }

    for (const contribution of paddingRef.current.values()) {
      result[contribution.edge] = Math.max(result[contribution.edge], contribution.value)
    }

    return result
  }, [paddingRef])

  const value = useMemo<MapContextInstance>(
    () => ({
      camera,
      fitBounds: (bounds) => {
        const padding = getPadding()

        camera.current?.fitBounds(bounds, {
          duration: 750,
          padding: {
            bottom: padding.bottom,
            left: padding.left,
            right: padding.right,
            top: padding.top,
          },
          pitch: 0,
        })
      },
      flyTo: (options) => {
        camera.current?.flyTo({
          duration: 1000,
          zoom: 14,
          ...options,
        })
      },
      getPadding,
      map,
      registerPadding,
      unRegisterPadding,
    }),
    [map, camera, getPadding, registerPadding],
  )

  return <MapContext value={value}>{children}</MapContext>
}
