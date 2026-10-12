import { Platform, useWindowDimensions } from 'react-native'
import { useCSSVariable } from 'uniwind'

import { useLineGroup } from './useLineGroup'

export const useLineCardWidth = () => {
  const { codes } = useLineGroup()
  const { width } = useWindowDimensions()

  let spacing = useCSSVariable('--spacing') as number
  if (typeof spacing === 'string' && Platform.OS === 'web') {
    spacing = 4
  }

  const gap = spacing * 2
  const sidePeek = spacing * 4
  const cardWidth = codes.length > 1 ? width - sidePeek * 2 : width

  const snapInterval = cardWidth - (spacing * 2) + (sidePeek / 2)

  return {
    cardWidth,
    gap,
    snapInterval,
  }
}
