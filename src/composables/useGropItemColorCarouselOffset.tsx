import { use } from 'react'
import { interpolateColor, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { useShallow } from 'zustand/shallow'

import { useFilterStore, useThemeStore } from '@/stores'

import { useColorScheme } from './useColorScheme'
import { CarouselContext } from '@/components/provider/CarouselProvider';

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

  const backgroundColors = schemes.map(scheme => scheme['ui-bg'])
  const borderColors = schemes.map(scheme => scheme['ui-border-muted'])

    console.log(backgroundColors)
  const style = useAnimatedStyle(() => {
    if (carouselContext?.snapPoints && carouselContext.snapPoints.value.length < 1) {
      return {}
    }

    const points = carouselContext?.snapPoints.value.map((point) => {
      'worklet'
      return Math.abs(point)
    }) ?? []

    const _offset = Math.abs(offset.value)
    console.log(_offset, points)

    return {
      backgroundColor: interpolateColor(_offset, points, backgroundColors, 'LAB', { gamma: 1}),
      borderColor: interpolateColor(_offset, points, borderColors, 'LAB', { gamma: 1}),
    }
  })

  return {
    offset,
    style,
  }
}
