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
}

export const UCarouselItem = ({
  className,
  index,
  children,
  offset,
  itemSize,
}: UCarouselItemProps) => {
  const { itemDimensions } = useCarouselState()

  //  this causes weird glitches when you navigate back to the page
  // useEffect(
  //   () => () => {
  //     itemDimensions.modify((current) => {
  //       'worklet'
  //       delete current[index]
  //       return current
  //     })
  //   },
  //   [index, itemDimensions],
  // )

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    transform: [{ translateX: offset.value + index * itemSize }],
  }))

  const onLayout = (event: LayoutChangeEvent) => {
    const { layout } = event.nativeEvent

    itemDimensions.modify((current) => {
      'worklet'
      current[index] = layout
      return current
    })
  }

  return (
    <Animated.View
      className={className}
      style={style}
      onLayout={onLayout}
    >
      {children}
    </Animated.View>
  )
}
