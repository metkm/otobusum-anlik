import type { CameraRef, MapRef, LngLatBounds } from '@maplibre/maplibre-react-native'
import { useMemo, useRef } from 'react'

import { MapContext } from '@/composables/useMap'

export const MapProvider = ({ children }: { children: React.ReactNode }) => {
  const map = useRef<MapRef>(null)
  const camera = useRef<CameraRef>(null)

  const value = useMemo(() => ({
    map,
    camera,
    fitBounds: (bounds: LngLatBounds) => {
      camera.current?.fitBounds(bounds, {
        duration: 1000,
        pitch: 0,
        padding: {
          bottom: 250,
          top: 80,
          left: 25,
          right: 25,
        },
      })
    },
  }), [map, camera])

  return (
    <MapContext value={value}>
      {children}
    </MapContext>
  )
}
