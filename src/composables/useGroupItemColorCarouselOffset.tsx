import { use } from 'react'
import { interpolateColor, useDerivedValue, useSharedValue } from 'react-native-reanimated'
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

  const offsetAbs = useDerivedValue(() => Math.abs(offset.value))

  const colors = useDerivedValue(() => {
    const matching =
      carouselContext?.snapPoints.value.flatMap((point, index) => {
        'worklet'
        const scheme = schemes.at(index)

        if (!scheme) {
          return []
        }

        return [
          {
            bg: scheme['ui-bg'],
            bgSoft: `${scheme['ui-primary']}1A`,
            borderMuted: scheme['ui-border-muted'],
            point: Math.abs(point),
          },
        ]
      }) ?? []

    return {
      bg: matching.map((x) => {
        'worklet'
        return x.bg
      }),
      bgSoft: matching.map((x) => {
        'worklet'
        return x.bgSoft
      }),
      borderMuted: matching.map((x) => {
        'worklet'
        return x.borderMuted
      }),
      points: matching.map((x) => {
        'worklet'
        return x.point
      }),
    }
  })

  const backgroundColor = useDerivedValue(() => {
    if (colors.value.points.length < 2) {
      return bg[0] ?? defaultBgDefault?.toString()
    }

    return interpolateColor(offsetAbs.value, colors.value.points, colors.value.bg, 'HSV')
  })

  const backgroundColorSoft = useDerivedValue(() => {
    if (colors.value.points.length < 2) {
      return bgSoft[0] ?? defaultBgMuted?.toString()
    }
    return interpolateColor(offsetAbs.value, colors.value.points, colors.value.bgSoft, 'HSV')
  })

  const borderColor = useDerivedValue(() => {
    if (colors.value.points.length < 2) {
      return borderMuted[0] ?? defaultBorderMuted?.toString()
    }

    return interpolateColor(offsetAbs.value, colors.value.points, colors.value.borderMuted, 'HSV')
  })

  return {
    backgroundColor,
    backgroundColorSoft,
    borderColor,
    offset,
  }
}
