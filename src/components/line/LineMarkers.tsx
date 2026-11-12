import { Layer } from '@maplibre/maplibre-react-native'

import { GroupItemContext } from '@/composables/useGroupItem'
import { useLineGroup } from '@/composables/useLineGroup'

import { ThemeProvider } from '../ThemeProvider'
import { LineMarkerBuses, LineMarkerRoute, LineMarkerStops } from './marker'

export const LineMarkers = () => {
  const { group } = useLineGroup()

  const items = group?.items.filter((item) => item.type === 'line') ?? []

  return (
    <>
      <Layer
        id="route-layer"
        type="background"
        paint={{ 'background-opacity': 0 }}
        layerIndex={10_000}
      />

      <Layer
        id="stop-layer"
        type="background"
        paint={{ 'background-opacity': 0 }}
        afterId="route-layer"
      />

      <Layer
        id="buses-layer"
        type="background"
        paint={{ 'background-opacity': 0 }}
        afterId="stop-layer"
      />

      {items.map((item) => (
        <GroupItemContext
          key={item.code}
          value={item.code}
        >
          <ThemeProvider value={item.code}>
            <LineMarkerBuses />
            <LineMarkerStops />
            <LineMarkerRoute />
          </ThemeProvider>
        </GroupItemContext>
      ))}

      {/* {codes.map((code) => (
        <LineContext
          key={code}
          value={code}
        >
          <ThemeProvider>
            <LineMarkerRoute />
            <LineMarkerStops />
            <LineMarkerBuses />
          </ThemeProvider>
        </LineContext>
      ))} */}
    </>
  )
}
