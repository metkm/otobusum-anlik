import { Layer } from '@maplibre/maplibre-react-native'
import { useShallow } from 'zustand/shallow'

import { GroupItemContext } from '@/composables/useGroupItem'
import { useFilterStore, useTransitStore } from '@/stores'
import type { GroupItem } from '@/stores/groups'

import { LineMarkers } from '../line/LineMarkers'
import { StopMarker } from '../stop/marker/StopMarker'

const GroupMarkers = ({ items }: { items: GroupItem[] }) => {
  const RenderItem = ({ item }: { item: GroupItem }) => {
    if (item.type === 'line') {
      return <LineMarkers code={item.code} />
    }

    return (
      <GroupItemContext value={item.code}>
        <StopMarker />
      </GroupItemContext>
    )
  }

  return items.map((item) => (
    <RenderItem
      key={item.code}
      item={item}
    />
  ))
}

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
