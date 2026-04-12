import { useRef } from 'react'
import { FlatList, Platform, useWindowDimensions } from 'react-native'
import Animated from 'react-native-reanimated'
import { useCSSVariable } from 'uniwind'

import { LineCard } from './LineCard'

import { DEFAULT_TIMING_FUNCTION } from '@/constants/transitions'
import { useLinesStore } from '@/stores/lines'

export const LineCards = () => {
  const flatlistRef = useRef<FlatList>(null)

  const lines = useLinesStore(state => state.linesByCity['istanbul'])
  const { width } = useWindowDimensions()

  let spacing = useCSSVariable('--spacing') as number
  if (typeof spacing === 'string' && Platform.OS === 'web') {
    spacing = 4
  }

  const lineWidth = width - (lines.length > 1 ? spacing * 10 : 0)

  return (
    <Animated.FlatList
      ref={flatlistRef}
      data={lines}
      itemLayoutAnimation={DEFAULT_TIMING_FUNCTION}
      renderItem={({ item }) => <LineCard lineCode={item} style={{ width: lineWidth }} />}
      horizontal
      contentContainerClassName="gap-2 min-h-24 min-w-full"
      contentContainerStyle={{
        padding: lines.length > 1 ? 8 : 0,
      }}
      keyExtractor={item => item}
    />
  )
}
