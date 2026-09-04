import { MapLayerOrder } from './MapLayerOrderContext'
import { LineMarkerBuses, LineMarkerRoute, LineMarkerStops } from './marker'

import { LineContext } from '@/composables/useLine'
import { useLines } from '@/composables/useLines'

export const LineMarkers = () => {
  const lines = useLines()

  return (
    <MapLayerOrder>
      {lines.map(code => (
        <LineContext value={code} key={code}>
          <LineMarkerRoute />
          <LineMarkerStops />
        </LineContext>
      ))}

      {lines.map(code => (
        <LineContext value={code} key={code}>
          <LineMarkerBuses />
        </LineContext>
      ))}
    </MapLayerOrder>
  )
}
