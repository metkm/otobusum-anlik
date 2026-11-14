import { use } from 'react'

import { MapContext } from '@/components/provider/MapProvider'

export const useMap = () => {
  const context = use(MapContext)

  if (!context) {
    throw new Error('MapContext should be inside MapProvider')
  }

  return context
}
