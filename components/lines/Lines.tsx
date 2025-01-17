import {
  ForwardedRef,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
import {
  FlatList,
  FlatListProps,
  ListRenderItem,
  Platform,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import Animated, { FlatListPropsWithLayout } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { LineMemoized, LineProps } from './line/Line'

import { useFiltersStore } from '@/stores/filters'
import { getLines, useLinesStore } from '@/stores/lines'
import { useMiscStore } from '@/stores/misc'

interface LinesProps {
  containerStyle?: ViewStyle
  contentContainerStyle?: ViewStyle
  lineProps?: Partial<LineProps>

  listProps?: Omit<FlatListPropsWithLayout<string>, 'data' | 'renderItem'>
}

// TODO: Some rerender issues are here.
const Lines = (props: LinesProps, outerRef: ForwardedRef<FlatList>) => {
  const innerRef = useRef<FlatList>(null)

  useImperativeHandle(outerRef, () => innerRef.current!, [])
  useFiltersStore(useShallow(state => state.selectedCity))

  const selectedGroup = useFiltersStore(useShallow(state => state.selectedGroup))
  const lines = useLinesStore(() => getLines())

  const previouslines = useRef<string[]>(lines)

  useEffect(() => {
    const scrolledToIndex = useMiscStore.getState().selectedLineScrollIndex
    if (lines.length === 0 || scrolledToIndex !== lines.length) return

    innerRef.current?.scrollToIndex({
      index: lines.length - 1,
      animated: true,
    })

    if (lines.length !== previouslines.current.length) {
      previouslines.current = lines
    }
  }, [lines])

  const renderItem: ListRenderItem<string> = useCallback(
    ({ item: code }) => {
      return <LineMemoized lineCode={code} {...props.lineProps} />
    },
    [props.lineProps],
  )

  type ViewableItems = FlatListProps<string>['onViewableItemsChanged']
  const handleViewableItemsChanged: ViewableItems = ({ viewableItems }) => {
    if (viewableItems.length < 1 || Platform.OS === 'web') return

    useMiscStore.setState(() => ({ selectedLineScrollIndex: viewableItems.at(0)?.index || 0 }))
  }

  const keyExtractor = useCallback((item: string) => `${item}-${selectedGroup}`, [selectedGroup])

  return (
    <View style={props.containerStyle}>
      <Animated.FlatList
        {...props.listProps}
        ref={innerRef}
        data={lines}
        renderItem={renderItem}
        viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
        contentContainerStyle={[styles.codes, props.contentContainerStyle]}
        keyExtractor={keyExtractor}
        onScrollToIndexFailed={() => {}}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        snapToAlignment="center"
        pagingEnabled
        horizontal

        {
          ...Platform.OS !== 'web'
            ? {
                onViewableItemsChanged: handleViewableItemsChanged,
              }
            : {}
        }
      />
    </View>
  )
}

export const LinesMomoizedFr = memo(forwardRef<FlatList, LinesProps>(Lines))

const styles = StyleSheet.create({
  codes: {
    gap: 8,
    padding: 8,
    alignItems: 'flex-end',
  },
})
