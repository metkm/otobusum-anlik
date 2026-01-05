import { ForwardedRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react'
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
import Animated, { FlatListPropsWithLayout } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { UiButton } from '../ui/UiButton'

import { LineMemoized, LineProps } from './line/Line'
import { LineGroups } from './line/LineGroups'

import { useFiltersStore } from '@/stores/filters'
import { getLines, useLinesStore } from '@/stores/lines'
import { useMiscStore } from '@/stores/misc'
import { i18n } from '@/translations/i18n'

interface LinesProps {
  cRef?: ForwardedRef<FlatList>
  containerStyle?: ViewStyle
  contentContainerStyle?: ViewStyle
  lineProps?: Partial<LineProps>
  listProps?: Omit<FlatListPropsWithLayout<string>, 'data' | 'renderItem'>
}

export const Lines = ({ cRef, ...props }: LinesProps) => {
  const innerRef = useRef<FlatList>(null)

  useImperativeHandle(cRef, () => innerRef.current!, [])

  useFiltersStore(useShallow(state => state.selectedCity))

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
      index: Math.max(0, lines.length - 1),
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

  const isGroupEmpty = !group ? true : group.lineCodes.length > 0 ? false : true

  return (
    <View style={props.containerStyle}>
      {!!group && (
        <View style={[styles.groupTitleContainer]}>
          <LineGroups
            type="select"
            trigger={(
              <UiButton
                icon="albums"
                title={!isGroupEmpty ? `${group.title}` : `${group.title} (${i18n.t('empty')})`}
                size="sm"
                variant="soft"
              />
            )}
          />
        </View>
      )}

      <Animated.FlatList
        {...props.listProps}
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
        {...(Platform.OS !== 'web'
          ? {
              onViewableItemsChanged: handleViewableItemsChanged,
            }
          : {})}
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
    marginLeft: 8,
    alignSelf: 'flex-start',
    borderRadius: 999,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
})
