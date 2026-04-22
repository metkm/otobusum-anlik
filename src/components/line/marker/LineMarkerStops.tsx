import { GeoJSONSource, Layer } from '@maplibre/maplibre-react-native'
import { router } from 'expo-router'
// eslint-disable-next-line import/no-unresolved
import { Feature } from 'geojson'

import { useLine } from '@/composables/useLine'
import { useLineStops } from '@/composables/useLineStops'
import { useLineTheme } from '@/composables/useLineTheme'

export const LineMarkerStops = () => {
  const { code } = useLine()
  const { query: { data } } = useLineStops()
  const theme = useLineTheme(code)

  if (!data)
    return

  const features: Feature[] = data.map(bus => ({
    type: 'Feature',
    properties: {
      code: bus.code,
    },
    geometry: {
      type: 'Point',
      coordinates: [bus.lng, bus.lat],
    },
  }))

  return (
    <GeoJSONSource
      data={{
        type: 'FeatureCollection',
        features,
      }}
      onPress={(event) => {
        const stopCode = event.nativeEvent.features[0]?.properties?.code
        if (!stopCode)
          return
        router.push(`/stop/${code}/${stopCode}`)
      }}
    >
      <Layer
        type="circle"
        paint={{
          'circle-radius': 6,
          'circle-color': theme?.['ui-bg-muted'],
          'circle-stroke-width': 2,
          'circle-stroke-color': theme?.['ui-border-muted'],
        }}
        layerIndex={12}
        minzoom={11}
      />
    </GeoJSONSource>
  )
}
