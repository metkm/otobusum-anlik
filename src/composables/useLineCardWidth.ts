import { Platform, useWindowDimensions } from 'react-native'
import { useCSSVariable } from 'uniwind'

export const useLineCardWidth = () => {
  const { width } = useWindowDimensions()

  let spacing = useCSSVariable('--spacing') as number
  if (typeof spacing === 'string' && Platform.OS === 'web') {
    spacing = 4
  }

  const gap = spacing * 2
  const sidePeek = spacing * 4
  const cardWidth = width - sidePeek

  const snapInterval = cardWidth - spacing * 2 + sidePeek / 2

  return {
    cardWidth,
    gap,
    snapInterval,
  }
}
