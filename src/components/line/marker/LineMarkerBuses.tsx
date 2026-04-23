import { GeoJSONSource, type ImageEntry, Images, Layer } from '@maplibre/maplibre-react-native'
import Lucide from '@react-native-vector-icons/lucide'
// eslint-disable-next-line import/no-unresolved
import { Feature } from 'geojson'
import { useShallow } from 'zustand/react/shallow'

import { useLine, useLineBuses, useLineTheme } from '@/composables'
import { useFilterStore } from '@/stores/filter'

export const LineMarkerBuses = () => {
  const { code } = useLine()
  const { query: lineBusesQuery } = useLineBuses()
  const isLineHidden = useFilterStore(useShallow(state => state.hiddenLines.includes(code)))
  const theme = useLineTheme(code)

  if (!lineBusesQuery.data)
    return

  const iconSource = Lucide.getImageSourceSync('bus-front', 20, theme?.['ui-text-inverted'])

  const iconImage = `bus-${code}`
  const images: Record<string, ImageEntry> = {}

  images[iconImage] = iconSource.uri

  const features: Feature[] = lineBusesQuery.data?.map(bus => ({
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Point',
      coordinates: [bus.lng, bus.lat],
    },
  }))

  return (
    <>
      <Images images={images} />

      <GeoJSONSource
        data={{
          type: 'FeatureCollection',
          features,
        }}
      >
        <Layer
          type="circle"
          paint={{ 'circle-radius': 16, 'circle-color': theme?.['ui-primary'] }}
          layout={{ visibility: isLineHidden ? 'none' : 'visible' }}
          layerIndex={12}
          minzoom={10}
          maxzoom={18}
        />

        <Layer
          type="symbol"
          layout={{
            'icon-image': iconImage,
            'icon-size': 0.3,
            'visibility': isLineHidden ? 'none' : 'visible',
          }}
          paint={{
            'icon-opacity-transition': { duration: 0 },
            'icon-color-transition': { duration: 0 },
          }}
          layerIndex={13}
          minzoom={10}
          maxzoom={18}
        />
      </GeoJSONSource>
    </>

  )
}
