import type { LayoutChangeEvent } from 'react-native'
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated'

import { LayoutAnimationTransition } from '@/constants/animation'

import type { RenderItem } from './UCarousel'
import type { ItemDimensions } from './UCarouselContainer'

interface UCarouselItemProps<T> {
  className?: string
  index: number
  offset: SharedValue<number>
  itemSize: number
  gap: number
  transformExtraOffset: number
  itemKey: string
  item: T
  renderItem: RenderItem<T>
  itemDimensions: SharedValue<ItemDimensions>
}

export const UCarouselItem = <T,>({
  className,
  index,
  offset,
  itemSize,
  gap,
  transformExtraOffset,
  itemKey,
  renderItem,
  item,
  itemDimensions,
}: UCarouselItemProps<T>) => {
  const style = useAnimatedStyle(() => {
    const dimensions = itemDimensions.value[itemKey]

    return {
      position: 'absolute',
      transform: [
        { translateX: offset.value + index * itemSize + index * gap + transformExtraOffset },
      ],
      width: itemSize || dimensions?.width || '100%',
    }
  })

  const registerLayout = (event: LayoutChangeEvent) => {
    const { layout } = event.nativeEvent

    itemDimensions.modify((current) => {
      'worklet'
      current[itemKey] = { height: layout.height, width: layout.width }
      return current
    })
  }

  return (
    <Animated.View
      layout={LayoutAnimationTransition}
      style={style}
      className={className}
    >
      {renderItem({ item }, registerLayout)}
    </Animated.View>
  )
}
