import type { CameraRef, LngLatBounds, MapRef } from '@maplibre/maplibre-react-native'
import { useMemo, useRef } from 'react'

import { MapContext } from '@/composables/useMap'

export const MapProvider = ({ children }: { children: React.ReactNode }) => {
  const map = useRef<MapRef>(null)
  const camera = useRef<CameraRef>(null)

  const value = useMemo(
    () => ({
      camera,
      fitBounds: (bounds: LngLatBounds) => {
        camera.current?.fitBounds(bounds, {
          duration: 750,
          padding: {
            bottom: 250,
            left: 25,
            right: 25,
            top: 80,
          },
          pitch: 0,
        })
      },
      map,
    }),
    [map, camera],
  )

  return <MapContext value={value}>{children}</MapContext>
}
