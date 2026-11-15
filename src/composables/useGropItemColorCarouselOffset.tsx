import { use } from 'react'
import {
  interpolateColor,
  // useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated'
import { useShallow } from 'zustand/shallow'

import { CarouselContext } from '@/components/provider/CarouselProvider'
import { useFilterStore, useThemeStore } from '@/stores'

import { useColorScheme } from './useColorScheme'

export const useGroupItemColorCarouselOffset = () => {
  const carouselContext = use(CarouselContext)

  const offsetLocal = useSharedValue(0)
  const offset = carouselContext?.offset ?? offsetLocal
  const colorScheme = useColorScheme()

  const city = useFilterStore(useShallow((state) => state.city))
  const schemes = useThemeStore(
    useShallow((state) =>
      Object.values(state.themesByCity[city]).map((schemes) => schemes[colorScheme]),
    ),
  )

  const bg = schemes.map((scheme) => scheme['ui-bg'])
  // const border = schemes.map((scheme) => scheme['ui-border-muted'])
  const bgMuted = schemes.map((scheme) => `${scheme['ui-primary']}1A`)

  const points = useDerivedValue(
    () =>
      carouselContext?.snapPoints.value.map((point) => {
        'worklet'
        return Math.abs(point)
      }) ?? [],
  )

  const offsetAbs = useDerivedValue(() => Math.abs(offset.value))

  const backgroundColor = useDerivedValue(() => {
    if (points.value.length < 1) {
      return bg[0] ?? 'transparent'
    }

    return interpolateColor(offsetAbs.value, points.value, bg, 'HSV')
  })

  const backgroundColorSoft = useDerivedValue(() => {
    if (points.value.length < 1) {
      return bg[0] ?? 'transparent'
    }

    return interpolateColor(offsetAbs.value, points.value, bgMuted, 'HSV')
  })

  return {
    backgroundColor,
    backgroundColorSoft,
    offset,
  }
}
