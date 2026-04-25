import { GeoJSONSource, type ImageEntry, Images, Layer } from '@maplibre/maplibre-react-native'
import Lucide from '@react-native-vector-icons/lucide'
import { useShallow } from 'zustand/react/shallow'

import { useLine, useLineRoutes, useLineTheme } from '@/composables'
import { useFilterStore } from '@/stores'

export const LineMarkerRoute = () => {
  const { code } = useLine()
  const { query: lineRoutesQuery, route, direction } = useLineRoutes()
  const isLineHidden = useFilterStore(useShallow(state => state.hiddenLines.includes(code)))
  const theme = useLineTheme(code)

  if (!lineRoutesQuery.data)
    return

  const coordinates = route?.path?.map(p => [p.lng, p.lat]) || []

  const images: Record<string, ImageEntry> = {}
  const iconImage = `route-arrow-${code}`

  images[iconImage] = Lucide.getImageSourceSync(direction === 'G' ? 'arrow-right' : 'arrow-left', 20, theme?.['ui-bg']).uri

  return (
    <>
      <Images images={images} />

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
            'line-color': theme?.['ui-primary'],
            'line-width': 8,
          }}
          layout={{
            'line-join': 'round',
            'line-cap': 'round',
            'visibility': isLineHidden ? 'none' : 'visible',
          }}
          layerIndex={10}
        />

        <Layer
          type="symbol"
          layout={{
            'symbol-placement': 'line',
            'icon-image': iconImage,
            'icon-rotation-alignment': 'map',
            'icon-size': 0.2,
            'symbol-spacing': 20,
            'visibility': isLineHidden ? 'none' : 'visible',
          }}
          paint={{
            'icon-opacity': 0.5,
          }}
          layerIndex={11}
        />
      </GeoJSONSource>
    </>
  )
}
