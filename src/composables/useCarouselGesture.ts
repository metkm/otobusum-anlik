import { use } from 'react'
import { usePanGesture } from 'react-native-gesture-handler'
import {
  clamp,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated'

import { CarouselContext } from '@/components/provider/CarouselProvider'
import { dampen } from '@/utils/math'

interface CarouselGestureOptions {
  containerWidth: SharedValue<number>
  viewportWidth: SharedValue<number>
  snapPoints: SharedValue<number[]>
  enabled?: boolean
}

const getClosestSnap = (offset: number, snaps: number[]) => {
  'worklet'
  return snaps.reduce(
    (closest, snap) => (Math.abs(snap - offset) < Math.abs(closest - offset) ? snap : closest),
    snaps[0] ?? 0,
  )
}

export const useCarouselGesture = ({
  containerWidth,
  viewportWidth,
  snapPoints,
  enabled = true,
}: CarouselGestureOptions) => {
  'worklet'
  const carouselContext = use(CarouselContext)

  const localOffset = useSharedValue(0)
  const offset = carouselContext?.offset ?? localOffset

  const offsetStart = useSharedValue(0)

  const limits = useDerivedValue(
    () => [-(containerWidth.value - viewportWidth.value), 0] satisfies [number, number],
  )

  const snap = () => {
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

      if (offset.value < limits.value[0] || offset.value > limits.value[1]) {
        snap()
        return
      }

      offset.set(withDecay({ clamp: limits.value, velocity: velocityX }, snap))
    },
    onUpdate: ({ translationX }) => {
      let newOffset = offsetStart.value + translationX

      if (newOffset < limits.value[0] || newOffset > limits.value[1]) {
        const modifier = translationX > 0 ? 1 : -1
        newOffset = offsetStart.value + dampen(Math.abs(translationX)) * modifier
      }

      offset.set(newOffset)
    },
  })

  useAnimatedReaction(
    () => containerWidth.value,
    (current, previous) => {
      if (previous && current < previous) {
        snap()
      }
    },
  )

  return {
    gesture,
    offset,
  }
}
