import { GroupItemContext } from '@/composables/useGroupItem'

import { LineMarkerBuses, LineMarkerRoute, LineMarkerStops } from '.'
import { ThemeProvider } from '../../provider/ThemeProvider'

export const LineMarkers = ({ code }: { code: string }) => (
  <GroupItemContext value={code}>
    <ThemeProvider value={code}>
      <LineMarkerBuses />
      <LineMarkerStops />
      <LineMarkerRoute />
    </ThemeProvider>
  </GroupItemContext>
)
