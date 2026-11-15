import { AnimatedLegendList } from '@legendapp/list/reanimated'
import type { ReactNode } from 'react'

import { LineCard } from '@/components/line/card/LineCard'
import { StopCard } from '@/components/stop/card/StopCard'
import { useLineGroup } from '@/composables'
import { GroupItemContext } from '@/composables/useGroupItem'
import type { GroupItem, GroupItemType } from '@/stores/groups'

import { CarouselCardHeightProvider } from '../provider/CarouselCardHeightProvider'
import { ThemeProvider } from '../provider/ThemeProvider'
import { UEmpty } from '../u'

interface GroupCardItemsProps {
  filter?: GroupItemType
}

export const GroupCardItems = ({ filter }: GroupCardItemsProps) => {
  const { group } = useLineGroup()

  const items = filter ? group?.items.filter((item) => item.type === filter) : group?.items

  const renderItem = ({ item }: { item: GroupItem }): ReactNode => {
    if (item.type === 'stop') {
      return (
        <GroupItemContext value={item.code}>
          <StopCard />
        </GroupItemContext>
      )
    }

    // return <UText>Test</UText>

    return (
      <GroupItemContext value={item.code}>
        <ThemeProvider>
          <LineCard />
        </ThemeProvider>
      </GroupItemContext>
    )
  }

  return (
    <CarouselCardHeightProvider>
      {/* <UCarousel
          data={items ?? []}
          renderItem={renderItem}
          onLayout={onLayout}
          keyExtractor={(item) => item.code}
          enabled={group?.items && group.items.length > 1}
          ui={{
            container: cn('gap-2 px-2 pb-2 items-end'),
            viewport: cn('w-screen', hideMap && 'grow'),
          }}
        /> */}

      <AnimatedLegendList
        data={items}
        renderItem={renderItem}
        recycleItems
        keyExtractor={(item) => item.code}
        contentContainerStyle={{ gap: 8, paddingBottom: 8, paddingHorizontal: 8 }}
        horizontal
        ListEmptyComponent={<UEmpty title="Empty group" />}
        nestedScrollEnabled
      />
    </CarouselCardHeightProvider>
  )
}
