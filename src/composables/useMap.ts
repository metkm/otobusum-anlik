import type { CameraRef, LngLatBounds, MapRef } from '@maplibre/maplibre-react-native'
import { createContext, use, type RefObject } from 'react'

export const MapContext = createContext<
  | {
      map: RefObject<MapRef | null>
      camera: RefObject<CameraRef | null>
      fitBounds: (bounds: LngLatBounds) => void
    }
  | undefined
>(undefined)

export const useMap = () => {
  const context = use(MapContext)

  if (!context) {
    throw new Error('MapContext should be inside MapProvider')
  }

  return context
}
