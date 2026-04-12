import { useRef } from 'react'
import { FlatList, useWindowDimensions } from 'react-native'
import Animated from 'react-native-reanimated'
import { useCSSVariable } from 'uniwind'

import { LineCard } from './LineCard'

import { DEFAULT_TIMING_FUNCTION } from '@/constants/transitions'
import { useLinesStore } from '@/stores/lines'

export const LineCards = () => {
  const flatlistRef = useRef<FlatList>(null)

  const lines = useLinesStore(state => state.linesByCity['istanbul'])
  const { width } = useWindowDimensions()

  const spacing = useCSSVariable('--spacing') as number
  const lineWidth = width - (lines.length > 1 ? spacing * 14 : 0)

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
