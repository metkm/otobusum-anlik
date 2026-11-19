import { useState } from 'react'
import { Dimensions } from 'react-native'
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

export const getVisibleRange = ({
  dataLength,
  viewportWidth,
  offsetIndex,
  visibleItemCount,
  drawDistance = 0,
}: {
  dataLength: number
  viewportWidth: number
  offsetIndex: number
  visibleItemCount: number
  drawDistance?: number
}): VisibleRange => {
  'worklet'

  if (dataLength <= 0) {
    return [0, 0]
  }

  if (viewportWidth <= 0) {
    return [0, viewportWidth]
  }

  return [
    Math.max(0, Math.floor(offsetIndex) - drawDistance - Math.floor(visibleItemCount)),
    Math.min(dataLength, Math.ceil(offsetIndex) + drawDistance + Math.ceil(visibleItemCount)),
  ]
}

export const useCarouselVirtualization = <T>({
  data,
  initialRenderCount,
  itemWidth,
  offset,
  viewportWidth,
  drawDistance,
}: CarouselVirtualizationOptions<T>) => {
  const offsetIndex = useDerivedValue(() => -offset.value / itemWidth)
  const visibleItemCount = useDerivedValue(() => viewportWidth.value / itemWidth)

  const range = useDerivedValue(() =>
    getVisibleRange({
      dataLength: data.length,
      drawDistance,
      offsetIndex: offsetIndex.value,
      viewportWidth: viewportWidth.value,
      visibleItemCount: visibleItemCount.value,
    }),
  )

  const initialRange = getVisibleRange({
    dataLength: data.length,
    offsetIndex: 0,
    viewportWidth: Dimensions.get('screen').width,
    visibleItemCount: initialRenderCount,
  })

  const [displayItems, setDisplayItems] = useState(initialRange)

  const updateDisplayItems = (range: VisibleRange) => {
    requestIdleCallback(() => {
      setDisplayItems(range)
    })
  }

  useAnimatedReaction(
    () => range.value,
    (current, previous) => {
      if (!previous) {
        return
      }

      if (current[0] === previous?.[0] && current[1] === previous[1]) {
        return
      }

      if (previous[0] === 0 && previous[1] === 0) {
        scheduleOnRN(setDisplayItems, initialRange)
        return
      }

      scheduleOnRN(updateDisplayItems, current)
    },
  )

  const items = displayItems

  return {
    displayedItems: items,
    range: [],
  }
}
