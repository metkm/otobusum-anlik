import { GeoJSONSource, Layer, type LayerProps } from '@maplibre/maplibre-react-native'
import { router } from 'expo-router'
import type { Feature } from 'geojson'
import { useCSSVariable } from 'uniwind'
import { useShallow } from 'zustand/react/shallow'

import { useLine, useLineStops, useLineTheme } from '@/composables'
import { useFilterStore } from '@/stores'

export const LineMarkerStopLayer = ({ isHidden, ...props }: { isHidden?: boolean } & Omit<Extract<LayerProps, { type: 'circle' }>, 'style' | 'type'>) => {
  const [defaultBg, defaultBorder] = useCSSVariable(['--ui-bg', '--ui-border'])
  const theme = useLineTheme()
  const { code } = useLine()

  const backgroundSoft = theme?.background({ variant: 'soft' })?.backgroundColor.slice(0, -2)
  const borderSoft = theme?.border({ variant: 'soft' })

  return (
    <Layer
      id={`stops-${code}`}
      type="circle"
      paint={{
        'circle-radius': 6,
        'circle-color': backgroundSoft ?? defaultBg as string,
        'circle-stroke-width': 2,
        'circle-stroke-color': borderSoft?.borderColor ?? defaultBorder as string,
        'circle-pitch-alignment': 'map',
      }}
      layout={{
        visibility: isHidden ? 'none' : 'visible',
      }}
      layerIndex={20_000}
      afterId={`route-path-arrows-${code}`}
      minzoom={11}
      {...props}
    />
  )
}

export const LineMarkerStops = () => {
  const { code } = useLine()
  const { query: lineStopsQuery } = useLineStops()
  const isLineHidden = useFilterStore(useShallow(state => state.hiddenLines.includes(code)))

  if (!lineStopsQuery.data)
    return

  const features: Feature[] = lineStopsQuery.data.map(bus => ({
    type: 'Feature',
    properties: {
      code: bus.code,
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
        if (!stopCode)
          return
        router.push(`/stop/${code}/${stopCode}`)
      }}
    >
      <LineMarkerStopLayer isHidden={isLineHidden} />
    </GeoJSONSource>
  )
}
