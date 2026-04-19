import { useRef } from 'react'
import { FlatList, Platform, useWindowDimensions } from 'react-native'
import { useCSSVariable } from 'uniwind'
import { useShallow } from 'zustand/react/shallow'

import { LineCard } from './LineCard'

import { useLineStore } from '@/stores/line'

export const LineCards = () => {
  const flatlistRef = useRef<FlatList>(null)

  const lines = useLineStore(useShallow(state => state.lines()))
  const { width } = useWindowDimensions()

  let spacing = useCSSVariable('--spacing') as number
  if (typeof spacing === 'string' && Platform.OS === 'web') {
    spacing = 4
  }

  const isOneElement = lines.length < 2
  const lineWidth = width - (isOneElement ? 0 : spacing * 10)

  return (
    <FlatList
      ref={flatlistRef}
      data={lines}
      renderItem={({ item }) => <LineCard lineCode={item} style={{ width: lineWidth }} className={lines.length < 2 ? 'rounded-none' : ''} />}
      horizontal
      contentContainerClassName={`gap-2 min-w-full ${isOneElement ? 'p-0' : 'pb-2 px-2'}`}
      keyExtractor={item => item}
    />
  )
}
