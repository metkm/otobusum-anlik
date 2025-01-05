import { View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { LineBusMarkers } from './bus/BusMarkers'
import { RouteLine } from './RouteLine'
import { LineBusStopMarkers } from './StopMarkers'

import { useFiltersStore } from '@/stores/filters'
import { getLines, useLinesStore } from '@/stores/lines'
import { useMiscStore } from '@/stores/misc'

export const LineMarkers = () => {
  const invisibleLines = useMiscStore(state => state.invisibleLines)

  useFiltersStore(useShallow(state => state.selectedCity))
  useFiltersStore(useShallow(state => state.selectedGroup))

  const lines = useLinesStore(() => getLines())
  const filteredCodes = lines.filter(lineCode => !invisibleLines.includes(lineCode))

  return (
    <>
      {filteredCodes.map(lineCode => (
        <View key={lineCode}>
          <RouteLine lineCode={lineCode} />

          <LineBusMarkers code={lineCode} />
          <LineBusStopMarkers lineCode={lineCode} />
        </View>
      ))}
    </>
  )
}
