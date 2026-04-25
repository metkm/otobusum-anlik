import { useShallow } from 'zustand/react/shallow'

import { LineMarkerBuses, LineMarkerRoute, LineMarkerStops } from './marker'

import { LineContext } from '@/composables/useLine'
import { useLineStore } from '@/stores'

export const LineMarkers = () => {
  const lines = useLineStore(useShallow(state => state.lines()))

  return lines.map(code => (
    <LineContext value={code} key={code}>
      <LineMarkerBuses />
      <LineMarkerRoute />
      <LineMarkerStops />
    </LineContext>
  ))
  // ))
}
