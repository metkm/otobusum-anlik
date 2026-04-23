import { useRef } from 'react'
import { FlatList } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { LineCard } from './card/LineCard'

import { useLineCardWidth } from '@/composables'
import { LineContext } from '@/composables/useLine'
import { useLineStore } from '@/stores/line'

export const LineCards = () => {
  const flatlistRef = useRef<FlatList>(null)
  const { cardWidth, snapInterval } = useLineCardWidth()

  const lines = useLineStore(useShallow(state => state.lines()))
  const isOneElement = lines.length < 2

  return (
    <FlatList
      ref={flatlistRef}
      data={lines}
      renderItem={({ item }) => (
        <LineContext value={item}>
          <LineCard
            style={{ width: cardWidth }}
            className={lines.length < 2 ? 'rounded-none' : ''}
          />
        </LineContext>
      )}
      contentContainerClassName={`gap-2 ${isOneElement ? 'p-0' : 'pb-2 px-2'}`}
      keyExtractor={item => item}
      snapToInterval={snapInterval}
      horizontal
      onEndReached={() => {
        flatlistRef.current?.scrollToIndex({
          index: lines.length - 1,
          viewPosition: -5,
        })
      }}
      onScrollToIndexFailed={() => {}}
      initialNumToRender={2}
      maxToRenderPerBatch={2}
    />
  )
}
