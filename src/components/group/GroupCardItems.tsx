import type { ReactNode } from 'react'
import { useSharedValue } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { LineCard } from '@/components/line/card/LineCard'
import { StopCard } from '@/components/stop/StopCard'
import { useLineGroup, useMapPadding } from '@/composables'
import { ExpandableCardContext } from '@/composables/useExpandableCard'
import { GroupItemContext } from '@/composables/useGroupItem'
import { CARD_COLLAPSED_HEIGHT } from '@/constants/card'
import { useSettingsStore } from '@/stores'
import type { GroupItem, GroupItemType } from '@/stores/groups'
import { cn } from '@/utils/cn'

import { ThemeProvider } from '../ThemeProvider'
import { UCarousel } from '../u'

interface GroupCardItemsProps {
  filter?: GroupItemType
}

export const GroupCardItems = ({ filter }: GroupCardItemsProps) => {
  const { group } = useLineGroup()
  const { onLayout } = useMapPadding('overlayGroupItems', 'bottom')
  const cardHeight = useSharedValue(CARD_COLLAPSED_HEIGHT)
  const hideMap = useSettingsStore(useShallow((state) => state.hideMap))

  const items = filter ? group?.items.filter((item) => item.type === filter) : group?.items

  const renderItem = ({ item }: { item: GroupItem }): ReactNode => {
    if (item.type === 'stop') {
      return (
        <GroupItemContext value={item.code}>
          <StopCard />
        </GroupItemContext>
      )
    }

    return (
      <GroupItemContext value={item.code}>
        <ThemeProvider>
          <LineCard />
        </ThemeProvider>
      </GroupItemContext>
    )
  }

  return (
    <ExpandableCardContext value={cardHeight}>
      <UCarousel
        data={items ?? []}
        renderItem={renderItem}
        onLayout={onLayout}
        keyExtractor={(item) => item.code}
        enabled={group?.items && group.items.length > 1}
        ui={{
          container: cn('gap-2 px-2 pb-2'),
          viewport: cn('w-screen', hideMap && 'grow'),
        }}
      />
    </ExpandableCardContext>
  )
}
