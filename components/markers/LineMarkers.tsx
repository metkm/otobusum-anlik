import { View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { LineBusMarkersMemoized } from './bus/BusMarkers'
import { RouteLine } from './RouteLine'
import { LineBusStopMarkers, LineBusStopMarkersMemoized } from './stop/StopMarkers'
import { LineBusStopMarkersClusteredMemoized } from './stop/StopMarkersClustered'

import { useFiltersStore } from '@/stores/filters'
import { getLines, useLinesStore } from '@/stores/lines'
import { useMiscStore } from '@/stores/misc'
import { useSettingsStore } from '@/stores/settings'

export const LineMarkers = () => {
  const invisibleLines = useMiscStore(state => state.invisibleLines)
  const clusterStops = useSettingsStore(useShallow(state => state.clusterStops))

  useFiltersStore(useShallow(state => state.selectedCity))
  useFiltersStore(useShallow(state => state.selectedGroup))

  const lines = useLinesStore(() => getLines())
  const filteredCodes = lines.filter(lineCode => !invisibleLines.includes(lineCode))

  return (
    <>
      {filteredCodes.map(lineCode => (
        <View key={lineCode}>
          <LineBusMarkersMemoized code={lineCode} />

          <LineBusStopMarkers lineCode={lineCode} />

          {/* {
            clusterStops
              ? <LineBusStopMarkersClusteredMemoized lineCode={lineCode} />
              : <LineBusStopMarkersMemoized lineCode={lineCode} />
          } */}

          <RouteLine lineCode={lineCode} />
        </View>
      ))}
    </>
  )
}
