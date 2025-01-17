import { View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { MarkersBuses } from '../buses/MarkersBuses'
import { MarkersStop } from '../stop/MarkersStop'

import { MarkersLineRouteLine } from './MarkersLineRouteLine'

import { useFiltersStore } from '@/stores/filters'
import { getLines, useLinesStore } from '@/stores/lines'
import { useMiscStore } from '@/stores/misc'

export const MarkersLine = () => {
  const invisibleLines = useMiscStore(state => state.invisibleLines)

  useFiltersStore(useShallow(state => state.selectedCity))
  useFiltersStore(useShallow(state => state.selectedGroup))

  const lines = useLinesStore(() => getLines())
  const filteredCodes = lines.filter(lineCode => !invisibleLines.includes(lineCode))

  return (
    <>
      {filteredCodes.map(lineCode => (
        <View key={lineCode}>
          <MarkersLineRouteLine lineCode={lineCode} />

          <MarkersBuses code={lineCode} />
          <MarkersStop lineCode={lineCode} />
        </View>
      ))}
    </>
  )
}
