import { Layer } from '@maplibre/maplibre-react-native'
import { useShallow } from 'zustand/shallow'

import { GroupItemContext } from '@/composables/useGroupItem'
import { useFilterStore, useTransitStore } from '@/stores'
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

const GroupMarkers = ({ items }: { items: GroupItem[] }) =>
  items.map((item) => (
    <GroupMarkerItem
      key={item.code}
      item={item}
    />
  ))

export const GroupsMarkers = () => {
  const city = useFilterStore(useShallow((state) => state.city))
  const groups = useTransitStore(useShallow((state) => state.groups[city]))

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

      {groups.map((group) => (
        <GroupMarkers
          key={group.id}
          items={group.items}
        />
      ))}
    </>
  )
}
