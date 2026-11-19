import type { ReactNode } from 'react'
import type { LayoutChangeEvent } from 'react-native'
import Animated, { useSharedValue } from 'react-native-reanimated'

import { cn, tv } from '@/utils/cn'

import { CarouselStateProvider } from '../../provider/CarouselStateProvider'
import { UCarouselContainer } from './UCarouselContainer'

const ui = tv({
  slots: {
    container: 'flex-row',
    item: 'min-w-0 shrink-0',
    viewport: 'flex-row overflow-hidden shrink',
  },
})

export interface UCarouselProps<T> {
  data: T[]
  renderItem: (props: { item: T }) => ReactNode
  keyExtractor: (item: T) => string
  getFixedItemSize: () => number
  ui?: {
    [K in keyof (typeof ui)['slots']]?: string
  }
  initialRenderCount: number
  drawDistance: number
  onLayout?: (event: LayoutChangeEvent) => void
}

export const UCarousel = <T,>({
  data,
  renderItem,
  keyExtractor,
  getFixedItemSize,
  initialRenderCount,
  drawDistance,
  onLayout,
  ui: _ui,
}: UCarouselProps<T>) => {
  const { viewport: uiViewport, container: uiContainer, item: uiItem } = ui()

  const viewportWidth = useSharedValue(0)

  return (
    <CarouselStateProvider>
      <Animated.View
        className={cn(uiViewport(), _ui?.viewport)}
        onLayout={(event) => {
          viewportWidth.value = event.nativeEvent.layout.width
          onLayout?.(event)
        }}
      >
        <UCarouselContainer
          data={data}
          drawDistance={drawDistance}
          initialRenderCount={initialRenderCount}
          itemSize={getFixedItemSize()}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          className={cn(uiContainer(), _ui?.container)}
          itemClassName={cn(uiItem(), _ui?.item)}
          viewportWidth={viewportWidth}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 8 }}
        />
      </Animated.View>
    </CarouselStateProvider>
  )
}
