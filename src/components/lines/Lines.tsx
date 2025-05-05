import {
  ForwardedRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
import {
  Dimensions,
  FlatList,
  FlatListProps,
  ListRenderItem,
  Platform,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import Animated, { FlatListPropsWithLayout, LinearTransition } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { useTheme } from '@/hooks/useTheme'

import { UiText } from '../ui/UiText'

import { LineMemoized, LineProps } from './line/Line'

import { useFiltersStore } from '@/stores/filters'
import { getLines, useLinesStore } from '@/stores/lines'
import { useMiscStore } from '@/stores/misc'

interface LinesProps {
  cRef?: ForwardedRef<FlatList>
  containerStyle?: ViewStyle
  contentContainerStyle?: ViewStyle
  lineProps?: Partial<LineProps>
  listProps?: Omit<FlatListPropsWithLayout<string>, 'data' | 'renderItem'>
}

// TODO: Some rerender issues are here.
export const Lines = ({ cRef, ...props }: LinesProps) => {
  const innerRef = useRef<FlatList>(null)
  useImperativeHandle(cRef, () => innerRef.current!, [])

  useFiltersStore(useShallow(state => state.selectedCity))

  const { schemeDefault } = useTheme()
  const selectedGroup = useFiltersStore(useShallow(state => state.selectedGroup))
  const selectedCity = useFiltersStore(useShallow(state => state.selectedCity))!
  const lineGroups = useLinesStore(useShallow(state => state.lineGroups))
  const lines = useLinesStore(() => getLines())

  const group = selectedGroup ? lineGroups[selectedCity][selectedGroup] : undefined
  const previouslines = useRef<string[]>(lines)

  useEffect(() => {
    const scrolledToIndex = useMiscStore.getState().scrolledLineIndex
    if (lines.length === 0 || scrolledToIndex !== lines.length) return

    innerRef.current?.scrollToIndex({
      index: lines.length - 1,
      animated: true,
    })

    if (lines.length !== previouslines.current.length) {
      previouslines.current = lines
    }
  }, [cRef, lines])

  const renderItem: ListRenderItem<string> = useCallback(
    ({ item: code }) => {
      return <LineMemoized lineCode={code} {...props.lineProps} />
    },
    [props.lineProps],
  )

  type ViewableItems = FlatListProps<string>['onViewableItemsChanged']
  const handleViewableItemsChanged: ViewableItems = ({ viewableItems }) => {
    if (viewableItems.length < 1 || Platform.OS === 'web') return

    useMiscStore.setState(() => ({ scrolledLineIndex: viewableItems.at(0)?.index || 0 }))
  }

  const keyExtractor = useCallback((item: string) => `${item}-${selectedGroup}`, [selectedGroup])

  return (
    <View style={props.containerStyle}>
      {!!group && (
        <View style={[styles.groupTitleContainer, { backgroundColor: schemeDefault.surfaceContainer }]}>
          <UiText size="sm">{group?.title}</UiText>
        </View>
      )}

      <Animated.FlatList
        {...props.listProps}
        itemLayoutAnimation={LinearTransition}
        ref={cRef}
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

const styles = StyleSheet.create({
  codes: {
    gap: 8,
    padding: 8,
    alignItems: 'flex-end',
    minWidth: Dimensions.get('screen').width,
  },
  groupTitleContainer: {
    padding: 8,
    paddingHorizontal: 14,
    marginLeft: 8,
    alignSelf: 'flex-start',
    borderRadius: 999,
    elevation: 2,
  },
})
