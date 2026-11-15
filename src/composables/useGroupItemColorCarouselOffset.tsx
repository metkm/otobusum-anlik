import { use } from 'react'
import {
  interpolateColor,
  // useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated'
import { useCSSVariable } from 'uniwind'
import { useShallow } from 'zustand/shallow'

import { CarouselContext } from '@/components/provider/CarouselProvider'
import { useFilterStore, useThemeStore } from '@/stores'

import { useColorScheme } from './useColorScheme'

export const useGroupItemColorCarouselOffset = () => {
  const carouselContext = use(CarouselContext)
  const [defaultBgDefault, defaultBgMuted, defaultBorderMuted] = useCSSVariable([
    '--background-color-default',
    '--background-color-muted',
    '--border-color-muted',
  ]) as [string, string, string]

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
  const borderMuted = schemes.map((scheme) => scheme['ui-border-muted'])
  const bgSoft = schemes.map((scheme) => `${scheme['ui-primary']}1A`)

  const points = useDerivedValue(
    () =>
      carouselContext?.snapPoints.value.map((point) => {
        'worklet'
        return Math.abs(point)
      }) ?? [],
  )

  const offsetAbs = useDerivedValue(() => Math.abs(offset.value))

  const backgroundColor = useDerivedValue(() => {
    if (points.value.length < 2) {
      return bg[0] ?? defaultBgDefault?.toString()
    }

    return interpolateColor(offsetAbs.value, points.value, bg, 'HSV')
  })

  const backgroundColorSoft = useDerivedValue(() => {
    if (points.value.length < 2) {
      return bgSoft[0] ?? defaultBgMuted?.toString()
    }

    return interpolateColor(offsetAbs.value, points.value, bgSoft, 'HSV')
  })

  const borderColor = useDerivedValue(() => {
    if (points.value.length < 2) {
      return borderMuted[0] ?? defaultBorderMuted?.toString()
    }

    return interpolateColor(offsetAbs.value, points.value, borderMuted, 'HSV')
  })

  return {
    backgroundColor,
    backgroundColorSoft,
    borderColor,
    offset,
  }
}
