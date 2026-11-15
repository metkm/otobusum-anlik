import { Layer } from '@maplibre/maplibre-react-native'

import { useLineGroup } from '@/composables'
import { GroupItemContext } from '@/composables/useGroupItem'
import type { GroupItem } from '@/stores/groups'

import { LineMarkerBuses, LineMarkerRoute, LineMarkerStops } from '../line/marker'
import { ThemeProvider } from '../provider/ThemeProvider'
import { StopMarkers } from '../stop/marker/StopMarkers'

const GroupMarkerItem = ({ item }: { item: GroupItem }) => {
  if (item.type === 'line') {
    return (
      <GroupItemContext value={item.code}>
        <ThemeProvider>
          <LineMarkerBuses />
          <LineMarkerStops />
          <LineMarkerRoute />
        </ThemeProvider>
      </GroupItemContext>
    )
  }

  return (
    <GroupItemContext value={item.code}>
      <StopMarkers />
    </GroupItemContext>
  )
}

export const GroupsMarkers = () => {
  const { items } = useLineGroup()

  return (
    <>
      <Layer
        id="route-layer"
        type="background"
        paint={{ 'background-opacity': 0 }}
        layerIndex={10_000}
      />

      <Layer
        id="stop-layer"
        type="background"
        paint={{ 'background-opacity': 0 }}
        afterId="route-layer"
      />

      <Layer
        id="buses-layer"
        type="background"
        paint={{ 'background-opacity': 0 }}
        afterId="stop-layer"
      />

      {items.map((item) => (
        <GroupMarkerItem
          key={item.code}
          item={item}
        />
      ))}
    </>
  )
}
