import type { CameraRef, MapRef } from '@maplibre/maplibre-react-native'
import { useMemo, useRef } from 'react'

import { MapContext, type MapContextInstance } from '@/composables/useMap'

export const MapProvider = ({ children }: { children: React.ReactNode }) => {
  const map = useRef<MapRef>(null)
  const camera = useRef<CameraRef>(null)

  const value = useMemo<MapContextInstance>(
    () => ({
      camera,
      fitBounds: (bounds) => {
        camera.current?.fitBounds(bounds, {
          duration: 750,
          padding: {
            bottom: 250,
            left: 25,
            right: 75,
            top: 10,
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
      map,
    }),
    [map, camera],
  )

  return <MapContext value={value}>{children}</MapContext>
}
