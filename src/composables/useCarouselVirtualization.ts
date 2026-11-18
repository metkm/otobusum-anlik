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

  const offsetIndex = useDerivedValue(() => Math.floor(-offset.value / itemWidth))

  const range = useDerivedValue<VisibleRange>(() => {
    if (viewportWidth.value <= 0) {
      return [0, 0]
    }

    return [
      Math.max(0, offsetIndex.value - drawDistance),
      Math.min(dataLength, offsetIndex.value + viewportWidth.value / itemWidth + drawDistance),
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

      console.log(current)
      scheduleOnRN(updateDisplayedItems, current)
    },
  )

  return {
    displayedItems,
    range,
  }
}
