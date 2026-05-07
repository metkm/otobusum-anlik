import { GeoJSONSource, Layer } from '@maplibre/maplibre-react-native'
import { router } from 'expo-router'
// eslint-disable-next-line import/no-unresolved
import { Feature } from 'geojson'
import { useCSSVariable } from 'uniwind'
import { useShallow } from 'zustand/react/shallow'

import { useLine, useLineStops, useLineTheme } from '@/composables'
import { useFilterStore } from '@/stores'

export const LineMarkerStops = () => {
  const [defaultBg, defaultBorder] = useCSSVariable(['--ui-bg', '--ui-border'])

  const { code } = useLine()
  const { query: lineStopsQuery } = useLineStops()
  const isLineHidden = useFilterStore(useShallow(state => state.hiddenLines.includes(code)))
  const theme = useLineTheme()

  if (!lineStopsQuery.data)
    return

  const backgroundSoft = theme?.background({ variant: 'soft' })?.backgroundColor.slice(0, -2)
  const borderSoft = theme?.border({ variant: 'soft' })

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
      <Layer
        type="circle"
        paint={{
          'circle-radius': 6,
          'circle-color': backgroundSoft ?? defaultBg as string,
          'circle-stroke-width': 2,
          'circle-stroke-color': borderSoft?.borderColor ?? defaultBorder as string,
        }}
        layout={{
          visibility: isLineHidden ? 'none' : 'visible',
        }}
        layerIndex={110}
        minzoom={11}
      />
    </GeoJSONSource>
  )
}
