import { useEffect, type ReactNode } from 'react'
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated'

import { useCarouselState } from '@/composables/useCarouselState'

interface UCarouselItemProps {
  className?: string
  index: number
  children: ReactNode
  offset: SharedValue<number>
  itemSize: number
}

export const UCarouselItem = ({
  className,
  index,
  children,
  offset,
  itemSize,
}: UCarouselItemProps) => {
  const { itemDimensions } = useCarouselState()

  useEffect(
    () => () => {
      itemDimensions.modify((current) => {
        'worklet'
        delete current[index]
        return current
      })
    },
    [index, itemDimensions],
  )

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    transform: [{ translateX: offset.value + index * itemSize }],
  }))

  return (
    <Animated.View
      className={className}
      style={style}
      onLayout={({ nativeEvent }) => {
        itemDimensions.modify((current) => {
          'worklet'
          current[index] = nativeEvent.layout
          return current
        })
      }}
    >
      {children}
    </Animated.View>
  )
}
