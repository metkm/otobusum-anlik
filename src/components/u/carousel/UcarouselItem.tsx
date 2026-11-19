import { type ReactNode } from 'react'
import type { LayoutChangeEvent } from 'react-native'
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated'

import { useCarouselState } from '@/composables/useCarouselState'

interface UCarouselItemProps {
  className?: string
  index: number
  children: ReactNode
  offset: SharedValue<number>
  itemSize: number
  gap: number
  transformExtraOffset: number
  itemKey: string
}

export const UCarouselItem = ({
  className,
  index,
  children,
  offset,
  itemSize,
  gap,
  transformExtraOffset,
  itemKey,
}: UCarouselItemProps) => {
  const { itemDimensions } = useCarouselState()

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    transform: [
      { translateX: offset.value + index * itemSize + index * gap + transformExtraOffset },
    ],
  }))

  const onLayout = (event: LayoutChangeEvent) => {
    const { layout } = event.nativeEvent

    itemDimensions.modify((current) => {
      'worklet'
      current[itemKey] = { height: layout.height, width: layout.width }
      return current
    })
  }

  return (
    <Animated.View
      onLayout={onLayout}
      style={style}
      className={className}
    >
      {children}
    </Animated.View>
  )
}
