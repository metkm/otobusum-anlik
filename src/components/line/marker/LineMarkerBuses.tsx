import { GeoJSONSource, Images } from '@maplibre/maplibre-react-native'
import { Lucide } from '@react-native-vector-icons/lucide'
import { router } from 'expo-router'
import type { GeoJSON, GeoJsonProperties, Geometry } from 'geojson'
import { useCSSVariable } from 'uniwind'
import { useShallow } from 'zustand/react/shallow'

import { MarkerBusLayer } from '@/components/marker/MarkerBusLayer'
import { useGroupItem } from '@/composables'
import { useLineBuses, useLineRoutes } from '@/composables/query'
import { useFilterStore } from '@/stores'

export const LineMarkerBuses = () => {
  const { code } = useGroupItem()
  const { routeCode } = useLineRoutes()
  const { buses } = useLineBuses()

  const backgroundColor = useCSSVariable('--color-primary')?.toString()
  const accentColor = useCSSVariable('--text-color-inverted')?.toString()

  const isLineHidden = useFilterStore(useShallow((state) => state.hiddenLines.includes(code)))

  if (buses.length < 1) {
    return
  }

  const data: GeoJSON<Geometry, GeoJsonProperties> = {
    features: buses
      .filter((x) => x.route_code === routeCode)
      .map((bus) => ({
        geometry: {
          coordinates: [bus.lng, bus.lat],
          type: 'Point',
        },
        properties: {
          backgroundColor,
          doorNo: bus.bus_id,
        },
        type: 'Feature',
      })),
    type: 'FeatureCollection',
  }

  const iconName = `bus-front-${code}`

  return (
    <>
      <Images
        images={{
          [iconName]: Lucide.getImageSourceSync('bus-front', 20, accentColor).uri,
        }}
      />

      <GeoJSONSource
        data={data}
        onPress={(event) => {
          const doorNo = event.nativeEvent.features[0]?.properties?.doorNo
          if (doorNo) {
            router.navigate(`/bus-info/${doorNo}`)
          }
        }}
      >
        <MarkerBusLayer
          code={code}
          isHidden={isLineHidden}
        />
      </GeoJSONSource>
    </>
  )
}
