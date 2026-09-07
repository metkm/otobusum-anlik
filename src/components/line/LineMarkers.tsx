import { Layer } from '@maplibre/maplibre-react-native'

import { LineMarkerBuses, LineMarkerRoute, LineMarkerStops } from './marker'

import { LineContext } from '@/composables/useLine'
import { useLines } from '@/composables/useLines'

export const LineMarkers = () => {
  const lines = useLines()

  return (
    <>
      <Layer
        id="route-layer"
        type="background"
        paint={{
          'background-opacity': 0,
          'background-color': 'rgba(0, 0, 0, 0)',
        }}
        layerIndex={200}
      />

      <Layer
        id="stop-layer"
        type="background"
        paint={{
          'background-opacity': 0,
        }}
        afterId="route-layer"
      />

      <Layer
        id="buses-layer"
        type="background"
        paint={{
          'background-opacity': 0,
          'background-color': 'rgba(0, 0, 0, 0)',
        }}
        afterId="stop-layer"
      />

      {lines.map(code => (
        <LineContext key={code} value={code}>
          <LineMarkerRoute />
          <LineMarkerStops />
          <LineMarkerBuses />
        </LineContext>
      ))}
    </>
  )
}
