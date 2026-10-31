import type {
  CameraAnimationOptions,
  CameraCenterOptions,
  CameraOptions,
  CameraRef,
  LngLatBounds,
  MapRef,
} from '@maplibre/maplibre-react-native'
import { createContext, use, type RefObject } from 'react'

import type { Padding } from '@/components/MapProvider'

export interface MapContextInstance {
  map: RefObject<MapRef | null>
  camera: RefObject<CameraRef | null>
  fitBounds: (bounds: LngLatBounds) => void
  flyTo: (bounds: CameraOptions & CameraCenterOptions & CameraAnimationOptions) => void

  registerPadding: (id: string, edge: keyof Padding, value: number) => void
  unRegisterPadding: (id: string) => void
  getPadding: () => Padding
}

export const MapContext = createContext<MapContextInstance | undefined>(undefined)

export const useMap = () => {
  const context = use(MapContext)

  if (!context) {
    throw new Error('MapContext should be inside MapProvider')
  }

  return context
}
