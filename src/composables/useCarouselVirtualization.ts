import { useState } from 'react'
import { useAnimatedReaction, useDerivedValue, type SharedValue } from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'

interface CarouselVirtualizationOptions<T> {
  data: T[]
  initialRenderCount: number
  itemWidth: number
  drawDistance: number
  viewportWidth: SharedValue<number>
  offset: SharedValue<number>
}

type VisibleRange = [number, number]

export const useCarouselVirtualization = <T>({
  data,
  initialRenderCount,
  itemWidth,
  offset,
  viewportWidth,
  drawDistance,
}: CarouselVirtualizationOptions<T>) => {
  const [displayedItems, setDisplayedItems] = useState<VisibleRange>([0, initialRenderCount])

  const offsetIndex = useDerivedValue(() => -offset.value / itemWidth)

  const range = useDerivedValue<VisibleRange>(() => {
    if (viewportWidth.value <= 0) {
      return [0, 0]
    }

    return [
      Math.max(0, offsetIndex.value - drawDistance),
      Math.min(data.length, offsetIndex.value + viewportWidth.value / itemWidth + drawDistance),
    ]
  })

  const updateDisplayedItems = (range: VisibleRange) => {
    requestIdleCallback(() => {
      setDisplayedItems(range)
    })
  }

  useAnimatedReaction(
    () => range.value,
    (current, previous) => {
      if (current[0] === previous?.[0] && current[1] === previous[1]) {
        return
      }

      scheduleOnRN(updateDisplayedItems, current)
    },
  )

  return {
    displayedItems,
    range,
  }
}
