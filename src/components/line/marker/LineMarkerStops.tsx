import { GeoJSONSource } from '@maplibre/maplibre-react-native'
import { router } from 'expo-router'
import type { GeoJSON, GeoJsonProperties, Geometry } from 'geojson'
import { useCSSVariable } from 'uniwind'
import { useShallow } from 'zustand/react/shallow'

import { MarkerStopLayer } from '@/components/marker/MarkerStopLayer'
import { useGroupItem } from '@/composables'
import { useLineStops } from '@/composables/query'
import { useFilterStore } from '@/stores'

export const LineMarkerStops = () => {
  const { code } = useGroupItem()
  const { query: lineStopsQuery } = useLineStops()

  const primaryColor = useCSSVariable('--color-primary')?.toString()
  const borderColor = useCSSVariable('--border-color-muted')?.toString()

  const isLineHidden = useFilterStore(useShallow((state) => state.hiddenLines.includes(code)))

  if (!lineStopsQuery.data) {
    return
  }

  const data: GeoJSON<Geometry, GeoJsonProperties> = {
    features: lineStopsQuery.data.map((bus) => ({
      geometry: {
        coordinates: [bus.lng, bus.lat],
        type: 'Point',
      },
      properties: {
        backgroundColor: primaryColor,
        borderColor,
        code: bus.code,
      },
      type: 'Feature',
    })),
    type: 'FeatureCollection',
  }

  return (
    <GeoJSONSource
      data={data}
      onPress={(event) => {
        const stopCode = event.nativeEvent.features[0]?.properties?.code
        if (stopCode) {
          router.navigate(`/stop/${stopCode}`)
        }
      }}
    >
      <MarkerStopLayer isHidden={isLineHidden} />
    </GeoJSONSource>
  )
}
