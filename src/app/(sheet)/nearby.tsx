import type { Feature } from 'geojson'
import { useEffect } from 'react'
import { View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { UQueryState } from '@/components/u/UQueryState'

import { useTransitNearby } from '@/composables/useTransitNearby'
import { useTemporaryMarkerStore } from '@/stores/temporaryMarker'

export const NearbyScreen = () => {
  const { query } = useTransitNearby()
  const addMarkers = useTemporaryMarkerStore(useShallow(state => state.addCollection))
  const removeMarkers = useTemporaryMarkerStore(useShallow(state => state.removeCollection))

  useEffect(() => {
    if (!query.data) {
      return
    }

    const stopFeatures: Feature[] = query.data.stops.map(stop => ({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [stop.lng, stop.lat],
      },
    }))

    const routeFeatures: Feature[] = query.data.routes.map(route => ({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: route.path?.map(p => [p.lng, p.lat]) ?? [],
      },
    }))

    addMarkers('stops', 'stops', {
      type: 'FeatureCollection',
      features: stopFeatures,
    })

    addMarkers('routes', 'routes', {
      type: 'FeatureCollection',
      features: routeFeatures,
    })

    return () => {
      removeMarkers('stops')
      removeMarkers('routes')
    }
  }, [addMarkers, query.data, removeMarkers])

  return (
    <View>
      <UQueryState query={query} />
    </View>
  )
}

export default NearbyScreen
