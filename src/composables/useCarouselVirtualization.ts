import { useState } from 'react'
import { useAnimatedReaction, useDerivedValue, type SharedValue } from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'

interface CarouselVirtualizationOptions {
  dataLength: number
  initialRenderCount: number
  itemWidth: number
  drawDistance: number
  viewportWidth: SharedValue<number>
  offset: SharedValue<number>
}

type VisibleRange = [number, number]

export const useCarouselVirtualization = ({
  dataLength,
  initialRenderCount,
  itemWidth,
  offset,
  viewportWidth,
  drawDistance,
}: CarouselVirtualizationOptions) => {
  const [displayedItems, setDisplayedItems] = useState<VisibleRange>([0, initialRenderCount])

  const offsetIndex = useDerivedValue(() => -offset.value / itemWidth)
  const visibleItem = useDerivedValue(() => viewportWidth.value / itemWidth)

  const range = useDerivedValue<VisibleRange>(() => {
    if (dataLength <= 0) {
      return [0, 0]
    }

    if (viewportWidth.value <= 0) {
      return [0, initialRenderCount]
    }

    return [
      Math.max(0, Math.floor(offsetIndex.value) - drawDistance - Math.floor(visibleItem.value)),
      Math.min(
        dataLength,
        Math.ceil(offsetIndex.value) + drawDistance + Math.ceil(visibleItem.value),
      ),
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
