import { createContext, type ReactNode, use, useEffect } from 'react'
import { useWindowDimensions, type ViewProps } from 'react-native'
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler'
import Animated, {
  clamp,
  LinearTransition,
  type SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withSpring,
} from 'react-native-reanimated'

import { EnterScaleIn, ExitScaleOut } from '@/constants/animation'
import { cn, tv } from '@/utils/cn'
import { alignCenter, dampen } from '@/utils/math'

const ui = tv({
  slots: {
    container: 'flex-row',
    item: 'min-w-0 shrink-0 grow-0',
    // item: 'min-w-0 shrink-0 grow-0 basis-[94%]',
    viewport: 'flex-row overflow-hidden',
  },
})

export interface UCarouselProps<T> extends ViewProps {
  data: T[]
  renderItem: (props: { item: T }) => ReactNode
  keyExtractor: (item: T) => string
  ui?: {
    [K in keyof (typeof ui)['slots']]?: string
  }
  enabled?: boolean
}

export const CarouselContext = createContext<SharedValue<number> | undefined>(undefined)

const getClosestSnap = (offset: number, snaps: number[]) => {
  'worklet'
  return snaps.reduce(
    (closest, snap) => (Math.abs(snap - offset) < Math.abs(closest - offset) ? snap : closest),
    snaps[0] ?? 0,
  )
}

export const UCarousel = <T,>({
  data,
  renderItem,
  keyExtractor,
  enabled = true,
  ...props
}: UCarouselProps<T>) => {
  'use no memo'
  // Have to disable react compiler or else it gives errors about reading shared values etc

  const carouselContext = use(CarouselContext)

  const { width: windowWidth } = useWindowDimensions()
  const { viewport: uiViewport, container: uiContainer, item: uiItem } = ui()

  const snapPoints = useSharedValue<number[]>([])
  const containerX = useSharedValue(0)
  const containerWidth = useSharedValue(0)
  const viewportWidth = useSharedValue(windowWidth)
  const slideWidth = useSharedValue(data.length > 1 ? 0.94 : 1)

  const localOffset = useSharedValue(0)

  const offset = carouselContext ?? localOffset
  const offsetStart = useSharedValue(0)

  const offsetLimits = useDerivedValue(
    () => [-(containerWidth.value - viewportWidth.value), 0] satisfies [number, number],
  )

  const snapToCard = () => {
    'worklet'

    const snap = getClosestSnap(offset.value, snapPoints.value)
    const clamped = clamp(snap, -(containerWidth.value - viewportWidth.value), 0)

    offset.set(withSpring(clamped))
  }

  const gesture = usePanGesture({
    activeOffsetX: [-25, 25],
    enabled,
    onActivate: () => {
      offsetStart.set(offset.value)
    },
    onDeactivate: ({ canceled, velocityX }) => {
      if (canceled) {
        return
      }

      if (offset.value < offsetLimits.value[0] || offset.value > offsetLimits.value[1]) {
        snapToCard()
        return
      }

      offset.set(withDecay({ clamp: offsetLimits.value, velocity: velocityX }, snapToCard))
    },
    onUpdate: ({ translationX }) => {
      let newOffset = offsetStart.value + translationX

      if (newOffset < offsetLimits.value[0] || newOffset > offsetLimits.value[1]) {
        const modifier = translationX > 0 ? 1 : -1
        newOffset = offsetStart.value + dampen(Math.abs(translationX)) * modifier
      }

      offset.set(newOffset)
    },
  })

  useEffect(() => {
    slideWidth.set(data.length > 1 ? 0.94 : 1)
  }, [data.length, slideWidth])

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }))

  // have to do this because using flexBasis is buggy. It doesn't update the value when it changes
  // https://github.com/react/react-native/issues/58294
  const slideStyle = useAnimatedStyle(() => ({
    width: viewportWidth.value * slideWidth.value - 16,
  }))

  useAnimatedReaction(
    () => containerWidth.value,
    (current, previous) => {
      if (previous && current < previous) {
        snapToCard()
      }
    },
  )

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        layout={LinearTransition}
        className={cn(uiViewport(), props.ui?.viewport)}
        {...props}
        onLayout={(event) => {
          'worklet'
          viewportWidth.set(event.nativeEvent.layout.width)
          props.onLayout?.(event)
        }}
      >
        <Animated.View
          className={cn(uiContainer(), props.ui?.container)}
          style={containerStyle}
          onLayout={({ nativeEvent }) => {
            'worklet'
            containerX.set(nativeEvent.layout.x)
            containerWidth.set(nativeEvent.layout.width)
          }}
        >
          {data.map((item, index) => (
            <Animated.View
              layout={LinearTransition}
              exiting={ExitScaleOut}
              entering={EnterScaleIn}
              key={keyExtractor(item)}
              style={slideStyle}
              className={cn(uiItem(), props.ui?.item)}
              onLayout={({ nativeEvent }) => {
                'worklet'
                const { x, width } = nativeEvent.layout

                const snap = -(x + containerX.value) + alignCenter(viewportWidth.value, width)

                snapPoints.modify((current) => {
                  'worklet'
                  current[index] = snap
                  return current
                })
              }}
            >
              {renderItem({ item })}
            </Animated.View>
          ))}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  )
}
