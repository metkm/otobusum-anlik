import { memo } from 'react'

import { useSettingsStore } from '@/stores/settings'
import { regionToZoom } from '@/utils/regionToZoom'

interface MarkersFiltersZoomProps {
  limit: number
  children: React.ReactNode
}

export const MarkersFiltersZoom = ({ limit, children }: MarkersFiltersZoomProps) => {
  const initialRegion = useSettingsStore(state => state.initialMapLocation)
  const currentZoom = initialRegion ? regionToZoom(initialRegion) : 0

  if (limit > currentZoom) return null

  return children
}

export const MarkersFiltersZoomMemoized = memo(MarkersFiltersZoom)
