import { Platform, useWindowDimensions } from 'react-native'
import { useCSSVariable } from 'uniwind'
import { useShallow } from 'zustand/react/shallow'

import { useLineStore } from '@/stores'

export const useLineCardWidth = () => {
  const lines = useLineStore(useShallow(state => state.lines()))
  const { width } = useWindowDimensions()

  let spacing = useCSSVariable('--spacing') as number
  if (typeof spacing === 'string' && Platform.OS === 'web') {
    spacing = 4
  }

  const isOneElement = lines.length < 2
  const cardWidth = width - (isOneElement ? 0 : spacing * 6)

  return {
    cardWidth,
    snapInterval: cardWidth,
  }
}
