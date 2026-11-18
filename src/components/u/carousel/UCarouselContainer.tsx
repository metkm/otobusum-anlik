import type { ReactNode } from 'react'
import { GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  type SharedValue,
} from 'react-native-reanimated'

import { useCarouselGesture } from '@/composables/useCarouselGesture'
import { useCarouselState } from '@/composables/useCarouselState'
import { useCarouselVirtualization } from '@/composables/useCarouselVirtualization'

import { UCarouselItem } from './UcarouselItem'

interface UCarouselContainerProps<T> {
  className?: string
  itemClassName?: string
  data: T[]
  itemSize: number
  drawDistance: number
  initialRenderCount: number
  viewportWidth: SharedValue<number>
  keyExtractor: (item: T) => string
  renderItem: (props: { item: T }) => ReactNode
}

export const UCarouselContainer = <T,>({
  data,
  className,
  itemSize,
  drawDistance,
  initialRenderCount,
  viewportWidth,
  itemClassName,
  keyExtractor,
  renderItem,
}: UCarouselContainerProps<T>) => {
  const { itemDimensions } = useCarouselState()

  const containerWidth = itemSize * data.length

  const snapPoints = useDerivedValue<number[]>(() => [])

  const { gesture, offset } = useCarouselGesture({
    containerWidth,
    snapPoints,
    viewportWidth,
  })

  const { displayedItems } = useCarouselVirtualization({
    dataLength: data.length,
    drawDistance,
    initialRenderCount,
    itemWidth: itemSize,
    offset,
    viewportWidth,
  })

  const containerStyle = useAnimatedStyle(() => ({
    height: Math.max(
      ...Object.values(itemDimensions.value).map((x) => {
        'worklet'
        return x.height
      }),
    ),
    // transform: [{ translateX: offset.value }],
    width: containerWidth,
  }))

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        className={className}
        style={containerStyle}
      >
        {data.map((item, index) => {
          const isInRange = index >= displayedItems[0] && index < displayedItems[1]
          if (!isInRange) {
            return
          }

          return (
            <UCarouselItem
              key={keyExtractor(item)}
              className={itemClassName}
              index={index}
            >
              {renderItem({ item })}
            </UCarouselItem>
          )
        })}
      </Animated.View>
    </GestureDetector>
  )
}
