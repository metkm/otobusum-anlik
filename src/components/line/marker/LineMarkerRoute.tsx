import { GeoJSONSource, Layer } from '@maplibre/maplibre-react-native'

import { useLine } from '@/composables/useLine'
import { useLineRoute } from '@/composables/useLineRoutes'
import { useLineTheme } from '@/composables/useLineTheme'

export const LineMarkerRoute = () => {
  const { code } = useLine()
  const { query: { data }, route } = useLineRoute()
  const theme = useLineTheme(code)

  if (!data)
    return

  const coordinates = route?.path?.map(p => [p.lng, p.lat]) || []

  return (
    <GeoJSONSource
      data={{
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates,
          },
        }],
      }}
    >
      <Layer
        type="line"
        paint={{
          'line-color': theme['ui-primary'],
          'line-width': 3,
        }}
      />
    </GeoJSONSource>
  )
}
