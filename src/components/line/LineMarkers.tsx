import { LineMarkerBuses, LineMarkerRoute, LineMarkerStops } from './marker'

import { LineContext } from '@/composables/useLine'
import { useLines } from '@/composables/useLines'

export const LineMarkers = () => {
  const lines = useLines()

  return lines.map(code => (
    <LineContext value={code} key={code}>
      <LineMarkerBuses />
      <LineMarkerRoute />
      <LineMarkerStops />
    </LineContext>
  ))
}
