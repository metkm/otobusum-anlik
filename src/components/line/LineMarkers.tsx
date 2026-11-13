import { GroupItemContext } from '@/composables/useGroupItem'

import { ThemeProvider } from '../ThemeProvider'
import { LineMarkerBuses, LineMarkerRoute, LineMarkerStops } from './marker'

export const LineMarkers = ({ code }: { code: string }) => (
  <GroupItemContext value={code}>
    <ThemeProvider value={code}>
      <LineMarkerBuses />
      <LineMarkerStops />
      <LineMarkerRoute />
    </ThemeProvider>
  </GroupItemContext>
)
