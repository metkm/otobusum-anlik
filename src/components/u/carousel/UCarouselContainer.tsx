import { useEffect, type ReactNode } from 'react'
import { GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedStyle,
  type SharedValue,
  type StyleProps,
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
  contentContainerStyle?: StyleProps
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
  contentContainerStyle,
  keyExtractor,
  renderItem,
}: UCarouselContainerProps<T>) => {
  const { itemDimensions } = useCarouselState()

  const gap =
    typeof contentContainerStyle?.gap === 'undefined' ? 0 : Number(contentContainerStyle.gap)
  const paddingHorizontal =
    typeof contentContainerStyle?.paddingHorizontal === 'undefined'
      ? 0
      : Number(contentContainerStyle.paddingHorizontal)

  const containerWidth = itemSize * data.length + gap * (data.length - 1) + paddingHorizontal * 2

  const { gesture, offset } = useCarouselGesture({
    containerWidth,
    dataLength: data.length,
    gap,
    itemWidth: itemSize,
    paddingStart: paddingHorizontal,
    viewportWidth,
  })

  const { displayedItems } = useCarouselVirtualization({
    data,
    drawDistance,
    initialRenderCount,
    itemWidth: itemSize,
    offset,
    viewportWidth,
  })

  useEffect(() => {
    const validKeys = new Set(data.map(keyExtractor))

    itemDimensions.modify((current) => {
      'worklet'

      return Object.fromEntries(Object.entries(current).filter(([key]) => validKeys.has(key)))
    })
  }, [data, keyExtractor, itemDimensions])

  const containerStyle = useAnimatedStyle(() => {
    let height = 0

    for (const item of Object.values(itemDimensions.value)) {
      height = Math.max(height, item.height)
    }

    return {
      height,
      width: containerWidth,
    }
  })

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

          const key = keyExtractor(item)

          return (
            <UCarouselItem
              key={key}
              className={itemClassName}
              offset={offset}
              index={index}
              itemSize={itemSize}
              gap={gap}
              transformExtraOffset={paddingHorizontal}
              itemKey={key}
            >
              {renderItem({ item })}
            </UCarouselItem>
          )
        })}
      </Animated.View>
    </GestureDetector>
  )
}
