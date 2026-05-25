import React, { createContext, use } from 'react'
import { Dimensions, ViewProps } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { clamp, LinearTransition, SharedValue, useAnimatedReaction, useAnimatedStyle, useDerivedValue, useSharedValue, withDecay, withSpring } from 'react-native-reanimated'

import { cn } from '@/utils/cn'

const width = Dimensions.get('window').width

const dampen = (value: number) => {
  'worklet'
  return 8 * Math.log(value + 1)
}

const roundToStep = (x: number, step: number) => {
  'worklet'
  // if (x < step) return 0
  return Math.round(x / step) * step
}

export const CarouselContext = createContext<SharedValue<number> | null>(null)

export const UCarousel = ({
  snapInterval,
  children,
  style,
  className,
  contentClassName,
  ...props
}: {
  snapInterval?: number
  children?: React.ReactNode
  contentClassName?: string
} & ViewProps) => {
  const carouselContext = use(CarouselContext)
  const internalOffset = useSharedValue(0)

  const offset = carouselContext ?? internalOffset
  const offsetStart = useSharedValue(0)
  const contentWidth = useSharedValue(0)

  const offsetLimit = useDerivedValue(() => -(contentWidth.value - width), [])

  const pan = Gesture.Pan()
    .activeOffsetX([-25, 25])
    .onStart(() => {
      offsetStart.value = offset.value
    })
    .onChange(({ translationX }) => {
      let newOffset = offsetStart.value + translationX
      let offsetModifier = translationX > 0 ? 1 : -1

      if ((newOffset > 0) || (newOffset < offsetLimit.value)) {
        newOffset = offsetStart.value + dampen(Math.abs(translationX)) * offsetModifier
      }

      offset.value = newOffset
    })
    .onFinalize(({ velocityX }, success) => {
      if (!success) return

      if (offset.value < offsetLimit.value) {
        offset.value = withSpring(offsetLimit.value)
        return
      }

      if (offset.value > 0) {
        offset.value = withSpring(0)
        return
      }

      offset.value = withDecay({
        velocity: velocityX,
        clamp: [offsetLimit.value, 0],
      }, () => {
        if (!snapInterval)
          return

        const clamped = clamp(offset.value, offsetLimit.value, 0)
        const rounded = roundToStep(clamped, snapInterval)

        offset.value = withSpring(clamp(rounded, offsetLimit.value, 0)) // clamped twice to remove padding on last element
      })
    })

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    }
  })

  useAnimatedReaction(() => contentWidth.value, () => {
    const limit = Math.min(0, -(contentWidth.value - width))
    if (offset.value < limit) {
      offset.value = withSpring(limit)
    }
  })

  return (
    <Animated.View
      layout={LinearTransition}
      className={cn('flex-row', className)}
      {...props}
    >
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[containerStyle]}
          className={cn('flex flex-row', contentClassName)}
          onLayout={({ nativeEvent }) => {
            const cw = nativeEvent.layout.width
            contentWidth.value = cw
          }}
        >
          {children}
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  )
}
