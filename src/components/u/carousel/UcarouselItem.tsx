import type { ReactNode } from 'react'
import Animated from 'react-native-reanimated'

import { useCarouselState } from '@/composables/useCarouselState'

interface UCarouselItemProps {
  className?: string
  index: number
  children: ReactNode
}

export const UCarouselItem = ({ className, index, children }: UCarouselItemProps) => {
  const { itemDimensions } = useCarouselState()

  return (
    <Animated.View
      className={className}
      style={{
        // position: 'absolute',
        // left: 0,
        // top: 0
        // transform: [{ translateX: index * getFixedItemSize() }],
      }}
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
