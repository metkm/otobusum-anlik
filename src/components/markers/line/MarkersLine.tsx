import { PointAnnotation, ShapeSource } from '@maplibre/maplibre-react-native'
import { Platform, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { MarkersBuses } from '../buses/MarkersBuses'
import { MarkersStop } from '../stop/MarkersStop'
import { MarkersStopClusteredMemoized } from '../stop/MarkersStopClustered'

import { MarkersLineRouteLine } from './MarkersLineRouteLine'

import { useFiltersStore } from '@/stores/filters'
import { getLines, useLinesStore } from '@/stores/lines'
import { useMiscStore } from '@/stores/misc'
import { useSettingsStore } from '@/stores/settings'

export const MarkersLine = () => {
  const invisibleLines = useMiscStore(state => state.invisibleLines)
  const clusterStops = useSettingsStore(useShallow(state => state.clusterStops))

  useFiltersStore(useShallow(state => state.selectedCity))
  useFiltersStore(useShallow(state => state.selectedGroup))

  const lines = useLinesStore(() => getLines())
  // const filteredCodes = lines.filter(lineCode => !invisibleLines.includes(lineCode))

  // return (
  //   <PointAnnotation id="tea" coordinate={[20, 0]}>
  //     <View style={{ width: 40, height: 40, backgroundColor: 'red' }} />
  //   </PointAnnotation>
  // )

  return (
    <>
      {lines.map(lineCode => (
        <MarkersStop key={`${lineCode}-stops`} lineCode={lineCode} />
      ))}
    </>
  )
}
