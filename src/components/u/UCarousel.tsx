import { createContext, ReactNode, use } from 'react'
import { Dimensions, type ViewProps } from 'react-native'
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler'
import Animated, {
  LinearTransition,
  clamp,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated'

import { cn } from '@/utils/cn'

const { width } = Dimensions.get('window')

const dampen = (value: number) => {
  'worklet'
  return 8 * Math.log(value + 1)
}

const roundToStep = (x: number, step: number) => {
  'worklet'
  return Math.round(x / step) * step
}

export const CarouselContext = createContext<SharedValue<number> | undefined>(undefined)

interface UCarouselProps extends ViewProps {
  snapInterval?: number
  children?: ReactNode
  contentClassName?: string
}

export const UCarousel = ({
  snapInterval,
  children,
  className,
  contentClassName,
  ...props
}: UCarouselProps) => {
  const carouselContext = use(CarouselContext)
  const internalOffset = useSharedValue(0)

  const offset = carouselContext ?? internalOffset
  const offsetStart = useSharedValue(0)
  const contentWidth = useSharedValue(0)

  const offsetLimit = useDerivedValue(() => -(contentWidth.value - width))

  const gesture = usePanGesture({
    activeOffsetX: [-25, 25],
    onActivate: () => {
      offsetStart.set(offset.value)
    },
    onDeactivate: ({ canceled, velocityX }) => {
      if (canceled) {
        return
      }

      if (offset.value < offsetLimit.value) {
        offset.set(withSpring(offsetLimit.value))
        return
      }

      if (offset.value > 0) {
        offset.set(withSpring(0))
        return
      }

      offset.set(
        withDecay(
          {
            clamp: [offsetLimit.value, 0],
            velocity: velocityX,
          },
          () => {
            if (!snapInterval) {
              return
            }

            const clamped = clamp(offset.value, offsetLimit.value, 0)
            const rounded = roundToStep(clamped, snapInterval)

            offset.value = withSpring(clamp(rounded, offsetLimit.value, 0)) // Clamped twice to remove padding on last element
          },
        ),
      )
    },
    onUpdate: ({ translationX }) => {
      let newOffset = offsetStart.value + translationX
      const offsetModifier = translationX > 0 ? 1 : -1

      if (newOffset > 0 || newOffset < offsetLimit.value) {
        newOffset = offsetStart.value + dampen(Math.abs(translationX)) * offsetModifier
      }

      offset.set(newOffset)
    },
  })

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }))

  useAnimatedReaction(
    () => contentWidth.value,
    () => {
      const limit = Math.min(0, -(contentWidth.value - width))
      if (offset.value < limit) {
        offset.set(withSpring(limit))
      }
    },
  )

  return (
    <Animated.View
      layout={LinearTransition}
      className={cn('flex-row', className)}
      {...props}
    >
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[containerStyle]}
          className={cn('flex flex-row', contentClassName)}
          onLayout={({ nativeEvent }) => {
            const cw = nativeEvent.layout.width
            contentWidth.set(cw)
          }}
        >
          {children}
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  )
}
