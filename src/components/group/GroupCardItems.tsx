import { type ReactNode } from 'react'
import { Dimensions } from 'react-native'
import Animated from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { LineCard } from '@/components/line/card/LineCard'
import { StopCard } from '@/components/stop/card/StopCard'
import { useLineGroup } from '@/composables'
import { GroupItemContext } from '@/composables/useGroupItem'
import { LayoutAnimationTransition } from '@/constants/animation'
import { useSettingsStore } from '@/stores'
import type { GroupItem, GroupItemType } from '@/stores/groups'
import { cn } from '@/utils/cn'

import { CarouselCardHeightProvider } from '../provider/CarouselCardHeightProvider'
import { ThemeProvider } from '../provider/ThemeProvider'
import { UCarousel } from '../u'

interface GroupCardItemsProps {
  filter?: GroupItemType
}

export const GroupCardItems = ({ filter }: GroupCardItemsProps) => {
  const { group } = useLineGroup()
  // const { onLayout } = useMapPadding('overlayGroupItems', 'bottom')
  // const { width: windowWidth } = useWindowDimensions()

  const hideMap = useSettingsStore(useShallow((state) => state.hideMap))

  const items = (filter ? group?.items.filter((item) => item.type === filter) : group?.items) ?? []

  const cardWidthModifier = items.length > 1 ? 0.94 : 1
  const cardWidth = Dimensions.get('window').width * cardWidthModifier

  const cardStyle = {
    width: cardWidth,
  }

  const renderItem = ({ item }: { item: GroupItem }): ReactNode => {
    if (item.type === 'stop') {
      return (
        <GroupItemContext value={item.code}>
          <Animated.View style={cardStyle}>
            <StopCard />
          </Animated.View>
        </GroupItemContext>
      )
    }

    return (
      <GroupItemContext value={item.code}>
        <ThemeProvider>
          <Animated.View style={cardStyle}>
            <LineCard />
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
          data={items ?? []}
          renderItem={renderItem}
          keyExtractor={(item) => item.code}
          getFixedItemSize={() => cardWidth}
          ui={{
            container: cn('gap-2 px-2 items-end'),
            viewport: cn('w-screen', hideMap && 'grow'),
          }}
          initialRenderCount={2}
          drawDistance={0}
        />

        {/* <FlatList
          data={items ?? []}
          renderItem={renderItem}
          keyExtractor={(item) => item.code}
          className="w-screen"
          contentContainerClassName="px-2 gap-2"
          windowSize={1}
          initialNumToRender={1}
          onLayout={onLayout}
          horizontal
          pagingEnabled
          snapToAlignment="center"
          getItemLayout={(_, index) => ({ index, length: cardWidth, offset: index * cardWidth })}
          maxToRenderPerBatch={2}
          showsHorizontalScrollIndicator={false}
        /> */}
      </Animated.View>
    </CarouselCardHeightProvider>
  )
}
