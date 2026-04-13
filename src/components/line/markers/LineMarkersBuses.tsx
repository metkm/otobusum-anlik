import { GeoJSONSource, Layer } from '@maplibre/maplibre-react-native'
// eslint-disable-next-line import/no-unresolved
import { Feature } from 'geojson'

import { useLineBuses } from '@/hooks/useLineBuses'

export const LineMarkersBuses = ({ code }: { code: string }) => {
  const { data } = useLineBuses(code)

  if (!data)
    return

  const features: Feature[] = data.map(bus => ({
    type: 'Feature',
    properties: {},
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
    >
      <Layer
        type="circle"
        paint={{ 'circle-radius': 20 }}
      />

      <Layer
        type="symbol"
        layout={{
          'icon-image': 'bus',
          'icon-size': 0.3,
        }}
        paint={{
          'icon-opacity-transition': { duration: 0 },
          'icon-color-transition': { duration: 0 },
        }}
      />
    </GeoJSONSource>
  )
}
