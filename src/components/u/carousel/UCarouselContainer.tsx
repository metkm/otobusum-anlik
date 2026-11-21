import { useEffect } from 'react'
import { GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedStyle,
  type SharedValue,
  type StyleProps,
} from 'react-native-reanimated'

import { useCarouselGesture } from '@/composables/useCarouselGesture'
import { useCarouselState } from '@/composables/useCarouselState'
import { useCarouselVirtualization } from '@/composables/useCarouselVirtualization'
import { LayoutAnimationTransition } from '@/constants/animation'

import type { RenderItem } from './UCarousel'
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
  renderItem: RenderItem<T>
  enabled?: boolean
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
  enabled = true,
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
    enabled,
    gap,
    itemWidth: itemSize,
    paddingStart: paddingHorizontal,
    viewportWidth,
  })

  const { displayItems } = useCarouselVirtualization({
    data,
    drawDistance,
    initialRenderCount,
    itemWidth: itemSize,
    offset,
    viewportWidth,
  })

  // every item mounts its width and height but we remove the unused ones here
  useEffect(() => {
    const validKeys = new Set(data.map(keyExtractor))

    itemDimensions.modify((current) => {
      'worklet'

      return Object.fromEntries(Object.entries(current).filter(([key]) => validKeys.has(key)))
    })
  }, [data, keyExtractor, itemDimensions])

  const containerStyle = useAnimatedStyle(() => {
    let itemsMaxHeight = 0

    for (const item of Object.values(itemDimensions.value)) {
      itemsMaxHeight = Math.max(itemsMaxHeight, item.height)
    }

    return {
      height: itemsMaxHeight,
      // height: itemsMaxHeight || '100%',
    }
  })

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        layout={LayoutAnimationTransition}
        className={className}
        style={containerStyle}
      >
        {data.map((item, index) => {
          const isInRange = index >= displayItems[0] && index < displayItems[1]
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
              item={item}
              renderItem={renderItem}
            />
          )
        })}
      </Animated.View>
    </GestureDetector>
  )
}
