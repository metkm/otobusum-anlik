import { Dimensions } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { LineCard } from '@/components/line/card/LineCard'
import { StopCard } from '@/components/stop/card/StopCard'
import { useLineGroup, useMapPadding } from '@/composables'
import { GroupItemContext } from '@/composables/useGroupItem'
import { useSettingsStore } from '@/stores'
import type { GroupItem, GroupItemType } from '@/stores/groups'

import { CarouselCardHeightProvider } from '../provider/CarouselCardHeightProvider'
import { ThemeProvider } from '../provider/ThemeProvider'
import { UCarousel } from '../u'
import type { RenderItem as CarouselRenderItem } from '../u/carousel/UCarousel'

interface GroupCardItemsProps {
  filter?: GroupItemType
}

export const GroupCardItems = ({ filter }: GroupCardItemsProps) => {
  const { group } = useLineGroup()
  const { onLayout } = useMapPadding('overlayGroupItems', 'bottom')

  const hideMap = useSettingsStore(useShallow((state) => state.hideMap))

  const items = (filter ? group?.items.filter((item) => item.type === filter) : group?.items) ?? []

  const cardWidthModifier = items.length > 1 ? 0.94 : 1
  const cardWidth = Dimensions.get('window').width * cardWidthModifier - 16

  const growClass = hideMap ? 'flex-1' : undefined

  const renderItem: CarouselRenderItem<GroupItem> = ({ item }, onLayout) => {
    if (item.type === 'stop') {
      return (
        <GroupItemContext value={item.code}>
          <StopCard
            onLayout={onLayout}
            // className={growClass}
          />
        </GroupItemContext>
      )
    }

    return (
      <GroupItemContext value={item.code}>
        <ThemeProvider>
          <LineCard
            onLayout={onLayout}
            // className={growClass}
          />
        </ThemeProvider>
      </GroupItemContext>
    )
  }

  return (
    <CarouselCardHeightProvider>
      <UCarousel
        onLayout={onLayout}
        data={items ?? []}
        renderItem={renderItem}
        keyExtractor={(item) => item.code}
        getFixedItemSize={() => cardWidth}
        ui={{
          container: growClass,
          item: hideMap ? 'top-0 bottom-0' : undefined,
          viewport: growClass,
        }}
        // ui={{ container: 'flex-1 pl-2 bg-green-400', item: 'top-0 bottom-0 max-h-full bg-amber-400 overflow-hidden', viewport: 'flex-1' }}
        // ui={{ container: growClass, item: hideMap?'bottom-0 top-0' : undefined, viewport: 'grow' }}
        initialRenderCount={2}
        drawDistance={1}
      />
    </CarouselCardHeightProvider>
  )
}
