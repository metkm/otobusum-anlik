import { GeoJSONSource, type ImageEntry, Images, Layer } from '@maplibre/maplibre-react-native'
import Lucide from '@react-native-vector-icons/lucide'
import type { Feature } from 'geojson'
import { useShallow } from 'zustand/react/shallow'

import { useLine, useLineRoutes, useLineTheme } from '@/composables'
import { useFilterStore } from '@/stores'

export const LineMarkerRouteLayer = ({ isHidden = false, code }: { isHidden?: boolean, code?: string }) => {
  const theme = useLineTheme()

  const background = theme?.background({ variant: 'solid' })
  const bgWithColor = theme?.backgroundWithColor({ variant: 'soft' })

  return (
    <>
      <Layer
        id={`route-path-${code}`}
        type="line"
        paint={{
          'line-color': background?.backgroundColor ?? ['get', 'color'],
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
          'visibility': isHidden ? 'none' : 'visible',
        }}
        afterId="route-layer"
      />

      <Layer
        id={`route-path-arrows-${code}`}
        type="symbol"
        layout={{
          'symbol-placement': 'line',
          'icon-image': `route-arrow-${code}`,
          'icon-size': 0.2,
          'symbol-spacing': 16,
          'visibility': isHidden ? 'none' : 'visible',
        }}
        paint={{
          'icon-opacity': 0.8,
        }}
        afterId={`route-path-${code}`}
      />

      <Layer
        id={`route-label-${code}`}
        type="symbol"
        layout={{
          'symbol-placement': 'line',
          'symbol-spacing': 100,
          'text-field': code ?? ['get', 'line_code'],
          'text-size': 10,
          'text-font': ['Roboto Bold'],
          'text-offset': [0, 0],
          'visibility': isHidden ? 'none' : 'visible',
        }}
        paint={{
          'text-color': bgWithColor?.backgroundColor ?? ['get', 'color'],
          'text-opacity': 0.6,
        }}
        afterId={`route-path-arrows-${code}`}
      />
    </>
  )
}

export const LineMarkerRoute = () => {
  const { code } = useLine()
  const { route, direction } = useLineRoutes()
  const isHidden = useFilterStore(useShallow(state => state.hiddenLines.includes(code)))

  const theme = useLineTheme()
  const text = theme?.text()

  if (!route?.path) {
    return
  }

  const coordinates = route?.path?.map(p => [p.lng, p.lat]) || []

  const feature: Feature = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates,
    },
  }

  const images: Record<string, ImageEntry> = {}
  const iconImage = `route-arrow-${code}`

  images[iconImage] = Lucide.getImageSourceSync(direction === 'G' ? 'arrow-right' : 'arrow-left', 20, text?.color).uri

  return (
    <>
      <Images images={images} />

      {coordinates.length > 1 && (
        <GeoJSONSource
          data={{
            type: 'FeatureCollection',
            features: [feature],
          }}
        >
          <LineMarkerRouteLayer
            isHidden={isHidden}
            code={code}
          />
        </GeoJSONSource>
      )}
    </>
  )
}
