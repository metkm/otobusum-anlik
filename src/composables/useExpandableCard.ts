import { createContext, use, useEffect } from 'react'
import {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  withTiming,
  withDelay,
  type SharedValue,
  useSharedValue,
} from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { CARD_EXPANDED_HEIGHT, CARD_COLLAPSED_HEIGHT } from '@/constants/card'
import { useSettingsStore } from '@/stores'

export const ExpandableCardContext = createContext<SharedValue<number> | undefined>(undefined)

export const useExpandableCardHeight = () => {
  const localHeight = useSharedValue(0)
  const height = use(ExpandableCardContext) ?? localHeight

  const expandStopsWhenScrolled = useSettingsStore(
    useShallow((state) => state.expandStopsWhenScrolled),
  )
  const lineCardExpanded = useSettingsStore(useShallow((state) => state.lineCardExpanded))
  const showLineCardStops = useSettingsStore(useShallow((state) => state.lineCardShowStops))

  useEffect(() => {
    const listener = useSettingsStore.subscribe(
      (state) => state.lineCardExpanded,
      (expanded) => {
        height.set(expanded ? CARD_EXPANDED_HEIGHT : CARD_COLLAPSED_HEIGHT)
      },
    )

    return listener
  }, [height])

  const onScroll = useAnimatedScrollHandler({
    onBeginDrag: () => {
      if (!expandStopsWhenScrolled) {
        return
      }

      height.set(CARD_EXPANDED_HEIGHT)
    },
    onMomentumEnd: () => {
      if (lineCardExpanded || (!expandStopsWhenScrolled && height.value !== CARD_EXPANDED_HEIGHT)) {
        return
      }

      height.set(withDelay(1500, withTiming(CARD_COLLAPSED_HEIGHT, { duration: 0 })))
    },
  })

  const style = useAnimatedStyle(() => ({
    minHeight: height.value,
  }))

  return { height, onScroll, style: showLineCardStops ? style : undefined }
}
