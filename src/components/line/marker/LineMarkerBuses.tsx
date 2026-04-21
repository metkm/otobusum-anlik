import { GeoJSONSource, type ImageEntry, Images, Layer } from '@maplibre/maplibre-react-native'
import Lucide from '@react-native-vector-icons/lucide'
// eslint-disable-next-line import/no-unresolved
import { Feature } from 'geojson'

import { useLine } from '@/composables/useLine'
import { useLineBuses } from '@/composables/useLineBuses'
import { useLineTheme } from '@/composables/useLineTheme'

export const LineMarkerBuses = () => {
  const { code } = useLine()
  const { query: { data } } = useLineBuses()
  const theme = useLineTheme(code)

  if (!data)
    return

  const iconSource = Lucide.getImageSourceSync('bus-front', 20, theme?.['ui-text-inverted'])

  const iconImage = `bus-${code}`
  const images: Record<string, ImageEntry> = {}

  images[iconImage] = iconSource.uri

  const features: Feature[] = data.map(bus => ({
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Point',
      coordinates: [bus.lng, bus.lat],
    },
  }))

  return (
    <>
      <Images
        images={images}
      />

      <GeoJSONSource
        data={{
          type: 'FeatureCollection',
          features,
        }}
      >

        <Layer
          type="circle"
          paint={{ 'circle-radius': 20, 'circle-color': theme?.['ui-primary'] }}
        />

        <Layer
          type="symbol"
          layout={{
            'icon-image': iconImage,
            'icon-size': 0.3,
          }}
          paint={{
            'icon-opacity-transition': { duration: 0 },
            'icon-color-transition': { duration: 0 },
          }}
        />
      </GeoJSONSource>
    </>

  )
}
