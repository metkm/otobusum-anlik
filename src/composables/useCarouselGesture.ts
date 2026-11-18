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

import { alignCenter, dampen } from '@/utils/math'

// import { useCarouselState } from './useCarouselState'

interface CarouselGestureOptions {
  containerWidth: number
  viewportWidth: SharedValue<number>
  dataLength: number,
  itemWidth: number,
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
  dataLength,
  itemWidth,
  enabled = true,
}: CarouselGestureOptions) => {
  'use no memo'

  // const { itemDimensions } = useCarouselState()

  const offset = useSharedValue(0)
  const offsetStart = useSharedValue(0)

  const limits = useDerivedValue<[number, number]>(() => [
    -(containerWidth - viewportWidth.value),
    0,
  ])

  const snap = () => {
    'worklet'

    const points = Array.from({ length: dataLength }, (_, index) => {
      'worklet'
      return -(index * itemWidth) + alignCenter(viewportWidth.value, itemWidth)
    })

    const snap = getClosestSnap(offset.value, points)
    const clamped = clamp(snap, -(containerWidth - viewportWidth.value), 0)

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
    () => containerWidth,
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
