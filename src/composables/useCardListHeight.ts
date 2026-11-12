import {
  useAnimatedScrollHandler,
  useSharedValue,
  withDelay,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { COLLAPSED_STOPS_HEIGHT, EXPANDED_STOPS_HEIGHT } from '@/constants/linecard'
import { useSettingsStore } from '@/stores'

export const useCardListHeight = () => {
  const expandStopsWhenScrolled = useSettingsStore(
    useShallow((state) => state.expandStopsWhenScrolled),
  )
  const containerHeight = useSharedValue(COLLAPSED_STOPS_HEIGHT)

  const style = useAnimatedStyle(() => ({
    height: containerHeight.value,
  }))

  const onScroll = useAnimatedScrollHandler({
    onBeginDrag: () => {
      if (!expandStopsWhenScrolled) {
        return
      }
      containerHeight.set(EXPANDED_STOPS_HEIGHT)
    },
    onMomentumEnd: () => {
      if (!expandStopsWhenScrolled && containerHeight.value !== EXPANDED_STOPS_HEIGHT) {
        return
      }
      containerHeight.set(withDelay(1500, withTiming(COLLAPSED_STOPS_HEIGHT)))
    },
  })

  return {
    onScroll,
    style,
  }
}
