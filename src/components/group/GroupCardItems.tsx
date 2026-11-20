import { Dimensions } from 'react-native'
import Animated from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { LineCard } from '@/components/line/card/LineCard'
import { StopCard } from '@/components/stop/card/StopCard'
import { useLineGroup, useMapPadding } from '@/composables'
import { GroupItemContext } from '@/composables/useGroupItem'
import { LayoutAnimationTransition } from '@/constants/animation'
import { useSettingsStore } from '@/stores'
import type { GroupItem, GroupItemType } from '@/stores/groups'
import { cn } from '@/utils/cn'

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

  const cardStyle = {
    width: cardWidth,
  }

  const renderItem: CarouselRenderItem<GroupItem> = ({ item }, onLayout) => {
    if (item.type === 'stop') {
      return (
        <GroupItemContext value={item.code}>
          <Animated.View style={cardStyle}>
            <StopCard onLayout={onLayout} />
          </Animated.View>
        </GroupItemContext>
      )
    }

    return (
      <GroupItemContext value={item.code}>
        <ThemeProvider>
          <Animated.View style={cardStyle}>
            <LineCard onLayout={onLayout} />
          </Animated.View>
        </ThemeProvider>
      </GroupItemContext>
    )
  }

  return (
    <CarouselCardHeightProvider>
      <Animated.View
        layout={LayoutAnimationTransition}
        className={cn(hideMap && 'grow')}
      >
        <UCarousel
          onLayout={onLayout}
          data={items ?? []}
          renderItem={renderItem}
          keyExtractor={(item) => item.code}
          getFixedItemSize={() => cardWidth}
          ui={{
            container: cn('gap-2 px-2 items-end'),
            viewport: cn('w-screen', hideMap && 'grow'),
          }}
          initialRenderCount={2}
          drawDistance={1}
        />
      </Animated.View>
    </CarouselCardHeightProvider>
  )
}
