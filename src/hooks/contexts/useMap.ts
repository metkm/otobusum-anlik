import { RefObject, createContext, useContext } from 'react'

import { TheMapRef } from '@/components/map/Map'

export const MapContext = createContext<RefObject<TheMapRef | null> | null>(null)

export const useMap = () => {
  const context = useContext(MapContext)

  return context
}
