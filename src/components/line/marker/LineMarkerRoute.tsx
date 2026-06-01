import { GeoJSONSource, type ImageEntry, Images, Layer } from '@maplibre/maplibre-react-native'
import Lucide from '@react-native-vector-icons/lucide'
import { useCSSVariable } from 'uniwind'
import { useShallow } from 'zustand/react/shallow'

import { useLine, useLineRoutes, useLineTheme } from '@/composables'
import { useFilterStore } from '@/stores'

export const LineMarkerRoute = () => {
  const defaultBg = useCSSVariable('--ui-bg')

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
  const backgroundSoft = theme?.background({ variant: 'soft' })

  images[iconImage] = Lucide.getImageSourceSync(direction === 'G' ? 'arrow-right' : 'arrow-left', 20, backgroundSoft?.backgroundColor).uri

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
            type="line"
            paint={{
              'line-color': background?.backgroundColor ?? defaultBg as string,
              'line-width': 8,
            }}
            layout={{
              'line-join': 'round',
              'line-cap': 'round',
              'visibility': isLineHidden ? 'none' : 'visible',
            }}
            layerIndex={800}
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
            layerIndex={801}
          />
        </GeoJSONSource>
      )}

    </>
  )
}
