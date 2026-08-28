import { GeoJSONSource, type ImageEntry, Images, Layer } from '@maplibre/maplibre-react-native'
import Lucide from '@react-native-vector-icons/lucide'
import { useCSSVariable } from 'uniwind'
import { useShallow } from 'zustand/react/shallow'

import { useLine, useLineRoutes, useLineTheme } from '@/composables'
import { useFilterStore } from '@/stores'

export const LineMarkerRoute = () => {
  const defaultBg = useCSSVariable('--ui-bg')
  const defaultText = useCSSVariable('--ui-primary')

  const { code } = useLine()
  const { query: lineRoutesQuery, route, direction } = useLineRoutes()
  const isLineHidden = useFilterStore(useShallow(state => state.hiddenLines.includes(code)))
  const theme = useLineTheme()

  if (!lineRoutesQuery.data)
    return

  const coordinates = route?.path?.map(p => [p.lng, p.lat]) || []

  const images: Record<string, ImageEntry> = {}
  const iconImage = `route-arrow-${code}`

  const background = theme?.background({ variant: 'solid' })
  const text = theme?.text()
  const bgWithColor = theme?.backgroundWithColor({ variant: 'soft' })

  images[iconImage] = Lucide.getImageSourceSync(direction === 'G' ? 'arrow-right' : 'arrow-left', 20, text?.color).uri

  return (
    <>
      <Images images={images} />

      {coordinates.length > 1 && (
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
            id={`route-path-${code}`}
            type="line"
            paint={{
              'line-color': background?.backgroundColor ?? defaultBg as string,
              'line-width': [
                'interpolate',
                ['linear'], ['zoom'],
                12, 8,
                17, 12,
              ],
            }}
            layout={{
              'line-join': 'round',
              'line-cap': 'round',
              'visibility': isLineHidden ? 'none' : 'visible',
            }}
            layerIndex={10_000}
          />

          <Layer
            id={`route-path-arrows-${code}`}
            type="symbol"
            layout={{
              'symbol-placement': 'line',
              'icon-image': iconImage,
              'icon-size': 0.2,
              'symbol-spacing': 34,
              'visibility': isLineHidden ? 'none' : 'visible',
            }}
            paint={{
              'icon-opacity': 0.6,
            }}
            afterId={`route-path-${code}`}
          />

          <Layer
            id={`route-km-${code}`}
            type="symbol"
            layout={{
              'symbol-placement': 'line',
              'symbol-spacing': 10,
              'text-ignore-placement': true,
              'text-field': code,
              'text-size': 10,
              'text-font': ['Roboto Bold'],
              'text-offset': [0, 0],
            }}
            paint={{
              'text-color': bgWithColor?.backgroundColor ?? defaultText as string,
              'text-opacity': 0.6,
            }}
            afterId={`route-path-${code}`}
          />
        </GeoJSONSource>
      )}

    </>
  )
}
