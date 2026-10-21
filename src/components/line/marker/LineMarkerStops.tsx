import { GeoJSONSource, Layer, type LayerProps } from '@maplibre/maplibre-react-native'
import { router } from 'expo-router'
import type { Feature } from 'geojson'
import { useCSSVariable } from 'uniwind'
import { useShallow } from 'zustand/react/shallow'

import { useLine, useLineStops } from '@/composables'
import { useFilterStore } from '@/stores'

export const LineMarkerStopLayer = ({
  isHidden,
  ...props
}: { isHidden?: boolean } & Omit<Extract<LayerProps, { type: 'circle' }>, 'style' | 'type'>) => {
  return (
    <Layer
      type="circle"
      paint={{
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 11, 4, 16, 7],
        'circle-color': ['get', 'color'],
        'circle-stroke-width': 2,
        'circle-stroke-color': ['get', 'borderColor'],
        'circle-pitch-alignment': 'map',
      }}
      layout={{
        visibility: isHidden ? 'none' : 'visible',
      }}
      minzoom={11}
      {...props}
    />
  )
}

export const LineMarkerStops = () => {
  const { code } = useLine()
  const { query: lineStopsQuery } = useLineStops()

  const primaryColor = useCSSVariable('--color-primary')?.toString()
  const borderColor = useCSSVariable('--border-color-muted')?.toString()

  const isLineHidden = useFilterStore(useShallow((state) => state.hiddenLines.includes(code)))

  if (!lineStopsQuery.data) return

  const features: Feature[] = lineStopsQuery.data.map((bus) => ({
    type: 'Feature',
    properties: {
      code: bus.code,
      color: primaryColor,
      borderColor: borderColor,
    },
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
      onPress={(event) => {
        const stopCode = event.nativeEvent.features[0]?.properties?.code
        if (!stopCode) return
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
