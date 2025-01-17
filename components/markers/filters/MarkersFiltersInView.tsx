import React, { useMemo } from 'react'
import { LatLng } from 'react-native-maps'

import { useSettingsStore } from '@/stores/settings'

interface VisibleMarkersProps<T> {
  data: T[]
  renderItem: (item: T) => React.ReactNode
}

export const MarkersFiltersInView = <T extends { coordinates: LatLng },>(props: VisibleMarkersProps<T>) => {
  const initialRegion = useSettingsStore(state => state.initialMapLocation)

  const filteredItems = useMemo(
    () => {
      if (!initialRegion) return []

      const startXOffset = initialRegion.longitudeDelta / 2
      const startYOffset = initialRegion.latitudeDelta / 2

      const x = initialRegion.longitude - startXOffset
      const maxX = initialRegion.longitude + startXOffset

      const y = initialRegion.latitude - startYOffset
      const maxY = initialRegion.latitude + startYOffset

      return props.data.filter(item => (
        item.coordinates.longitude > x
        && item.coordinates.longitude < maxX
        && item.coordinates.latitude > y
        && item.coordinates.latitude < maxY
      ))
    },
    [initialRegion, props.data],
  )

  if (!initialRegion) return

  return (
    <>
      {filteredItems.map(item => props.renderItem(item))}
    </>
  )
}
