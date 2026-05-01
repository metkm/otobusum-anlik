import type { CameraRef, MapRef } from '@maplibre/maplibre-react-native'
import { useMemo, useRef } from 'react'

import { MapContext } from '@/composables/useMap'

export const MapProvider = ({ children }: { children: React.ReactNode }) => {
  const map = useRef<MapRef>(null)
  const camera = useRef<CameraRef>(null)

  const value = useMemo(() => ({ map, camera }), [map, camera])

  return (
    <MapContext value={value}>
      {children}
    </MapContext>
  )
}
