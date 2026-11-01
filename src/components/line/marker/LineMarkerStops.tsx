import { GeoJSONSource, Layer, type LayerProps } from '@maplibre/maplibre-react-native'
import { router } from 'expo-router'
import type { Feature } from 'geojson'
import { useCSSVariable } from 'uniwind'
import { useShallow } from 'zustand/react/shallow'

import { useLine, useLineStops } from '@/composables'
import { useFilterStore } from '@/stores'

interface StopLayerProps extends Omit<Extract<LayerProps, { type: 'circle' }>, 'style' | 'type'> {
  isHidden?: boolean
}

export const LineMarkerStopLayer = ({ isHidden, ...props }: StopLayerProps) => (
  <Layer
    type="circle"
    paint={{
      'circle-color': ['get', 'color'],
      'circle-pitch-alignment': 'map',
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 11, 4, 16, 7],
      'circle-stroke-color': ['get', 'borderColor'],
      'circle-stroke-width': 2,
    }}
    layout={{
      visibility: isHidden ? 'none' : 'visible',
    }}
    minzoom={11}
    {...props}
  />
)

export const LineMarkerStops = () => {
  const { code } = useLine()
  const { query: lineStopsQuery } = useLineStops()

  const primaryColor = useCSSVariable('--color-primary')?.toString()
  const borderColor = useCSSVariable('--border-color-muted')?.toString()

  const isLineHidden = useFilterStore(useShallow((state) => state.hiddenLines.includes(code)))

  if (!lineStopsQuery.data) {
    return
  }

  const features: Feature[] = lineStopsQuery.data.map((bus) => ({
    geometry: {
      coordinates: [bus.lng, bus.lat],
      type: 'Point',
    },
    properties: {
      borderColor,
      code: bus.code,
      color: primaryColor,
    },
    type: 'Feature',
  }))

  return (
    <GeoJSONSource
      data={{
        features,
        type: 'FeatureCollection',
      }}
      onPress={(event) => {
        const stopCode = event.nativeEvent.features[0]?.properties?.code
        if (!stopCode) {
          return
        }
        router.navigate(`/stop/${stopCode}`)
      }}
    >
      <LineMarkerStopLayer
        isHidden={isLineHidden}
        id={`stops-${code}`}
        afterId="stop-layer"
      />
    </GeoJSONSource>
  )
}
