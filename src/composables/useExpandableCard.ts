import { use, useEffect } from 'react'
import {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  withTiming,
  withDelay,
  useSharedValue,
} from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { CarouselCardHeightContext } from '@/components/provider/CarouselCardHeightProvider'
import { CARD_EXPANDED_HEIGHT, CARD_COLLAPSED_HEIGHT } from '@/constants/card'
import { useSettingsStore } from '@/stores'

export const useExpandableCardHeight = () => {
  const localHeight = useSharedValue(CARD_COLLAPSED_HEIGHT)
  const height = use(CarouselCardHeightContext) ?? localHeight

  const cardExpandOnScroll = useSettingsStore(useShallow((state) => state.cardExpandOnScroll))
  const cardExpanded = useSettingsStore(useShallow((state) => state.cardExpanded))

  useEffect(() => {
    const listener = useSettingsStore.subscribe(
      (state) => state.cardExpanded,
      (expanded) => {
        height.set(expanded ? CARD_EXPANDED_HEIGHT : CARD_COLLAPSED_HEIGHT)
      },
    )

    return listener
  }, [height])

  const onScroll = useAnimatedScrollHandler({
    onBeginDrag: () => {
      if (!cardExpandOnScroll) {
        return
      }

      height.set(CARD_EXPANDED_HEIGHT)
    },
    onMomentumEnd: () => {
      if (cardExpanded || (!cardExpandOnScroll && height.value !== CARD_EXPANDED_HEIGHT)) {
        return
      }

      height.set(withDelay(1500, withTiming(CARD_COLLAPSED_HEIGHT, { duration: 0 })))
    },
  })

  const style = useAnimatedStyle(() => ({
    height: height.value,
  }))

  return { height, onScroll, style }
}
