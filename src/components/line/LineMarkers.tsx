import { Layer } from '@maplibre/maplibre-react-native'

import { ThemeProvider } from '../ThemeProvider'

import { LineMarkerBuses, LineMarkerRoute, LineMarkerStops } from './marker'

import { LineContext } from '@/composables/useLine'
import { useLineGroup } from '@/composables/useLineGroup'

export const LineMarkers = () => {
  const { codes } = useLineGroup()

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

      {codes.map(code => (
        <LineContext key={code} value={code}>
          <ThemeProvider>
            <LineMarkerRoute />
            <LineMarkerStops />
            <LineMarkerBuses />
          </ThemeProvider>
        </LineContext>
      ))}
    </>
  )
}
