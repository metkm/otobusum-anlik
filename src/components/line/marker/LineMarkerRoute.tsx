import { GeoJSONSource, type ImageEntry, Images, Layer } from '@maplibre/maplibre-react-native'
import Lucide from '@react-native-vector-icons/lucide'
import type { Feature } from 'geojson'
import { useCSSVariable } from 'uniwind'
import { useShallow } from 'zustand/react/shallow'

import { useLine, useLineRoutes } from '@/composables'
import { useFilterStore } from '@/stores'

export const LineMarkerRouteLayer = ({
  isHidden = false,
  code,
}: {
  isHidden?: boolean
  code?: string
}) => {
  return (
    <>
      <Layer
        id={`route-path-${code}`}
        type="line"
        paint={{
          'line-color': ['get', 'color'],
          'line-width': ['interpolate', ['linear'], ['zoom'], 12, 8, 17, 12],
        }}
        layout={{
          'line-join': 'round',
          'line-cap': 'round',
          visibility: isHidden ? 'none' : 'visible',
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
          visibility: isHidden ? 'none' : 'visible',
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
          visibility: isHidden ? 'none' : 'visible',
        }}
        paint={{
          'text-color': ['get', 'textColor'],
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

  const textColor = useCSSVariable('--text-color-inverted')?.toString()
  const primaryColor = useCSSVariable('--color-primary')?.toString()

  const isHidden = useFilterStore(useShallow((state) => state.hiddenLines.includes(code)))

  if (!route?.path) {
    return
  }

  const coordinates = route?.path?.map((p) => [p.lng, p.lat]) || []

  const feature: Feature = {
    type: 'Feature',
    properties: {
      color: primaryColor,
      textColor: textColor,
    },
    geometry: {
      type: 'LineString',
      coordinates,
    },
  }

  const images: Record<string, ImageEntry> = {}
  const iconImage = `route-arrow-${code}`

  images[iconImage] = Lucide.getImageSourceSync(
    direction === 'G' ? 'arrow-right' : 'arrow-left',
    20,
    textColor,
  ).uri

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
          <LineMarkerRouteLayer isHidden={isHidden} code={code} />
        </GeoJSONSource>
      )}
    </>
  )
}
