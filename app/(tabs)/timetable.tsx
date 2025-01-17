import { useCallback, useEffect } from 'react'
import {
  FlatList,
  LayoutChangeEvent,
  ListRenderItem,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import Animated, {
  Easing,
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/react/shallow'

import { LineTimetableMemoized } from '@/components/lines/line/LineTimetable'
import { LinesMomoizedFr } from '@/components/lines/Lines'
import { UiText } from '@/components/ui/UiText'

import { useFiltersStore } from '@/stores/filters'
import { getLines, useLinesStore } from '@/stores/lines'
import { useMiscStore } from '@/stores/misc'
import { i18n } from '@/translations/i18n'

export const TimetableScreen = () => {
  const insets = useSafeAreaInsets()
  const linesHeight = useSharedValue(0)
  const linesRef = useAnimatedRef<FlatList>()
  const timetablesRef = useAnimatedRef<FlatList>()

  const lines = useLinesStore(useShallow(() => getLines()))
  useFiltersStore(useShallow(state => state.selectedCity))

  const onLayout = useCallback(
    ({ nativeEvent }: LayoutChangeEvent) => {
      linesHeight.value = withTiming(nativeEvent.layout.height, {
        easing: Easing.out(Easing.quad),
      })
    },
    [linesHeight],
  )

  useEffect(() => {
    setTimeout(() => {
      const mx = Math.max(
        0,
        Math.min(
          useMiscStore.getState().selectedLineScrollIndex,
          lines.length - 1,
        ),
      )

      linesRef.current?.scrollToIndex({
        index: mx,
        viewPosition: 0.5,
      })
    }, 200)
  }, [linesRef, lines.length])

  const containerStyle: StyleProp<ViewStyle> = {
    paddingTop: insets.top,
    flex: 1,
  }

  const handleOnScroll = useAnimatedScrollHandler(({ contentOffset }) => {
    scrollTo(linesRef, contentOffset.x, 0, false)
    scrollTo(timetablesRef, contentOffset.x, 0, false)
  })

  const renderItem: ListRenderItem<string> = useCallback(
    ({ item }) => {
      return (
        <LineTimetableMemoized lineCode={item} />
      )
    },
    [],
  )

  const keyExtractor = useCallback(
    (item: string) => item,
    [],
  )

  if (lines.length < 1) {
    return (
      <UiText style={styles.center} info>
        {i18n.t('timetableEmpty')}
      </UiText>
    )
  }

  return (
    <View style={containerStyle}>
      <LinesMomoizedFr
        ref={linesRef}
        listProps={{
          onLayout,
          onScroll: handleOnScroll,
        }}
        containerStyle={{
          flexShrink: 0,
          padding: 0,
        }}
        contentContainerStyle={{
          paddingBottom: 0,
        }}
        lineProps={{
          variant: 'soft',
        }}
      />

      <Animated.FlatList
        ref={timetablesRef}
        data={lines}
        renderItem={renderItem}
        style={styles.list}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        onScroll={handleOnScroll}
        pagingEnabled
        snapToAlignment="center"
        horizontal
      />
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  list: {
    flexGrow: 1,
    flexShrink: 1,
    maxHeight: '100%',
  },
  listContent: {
    gap: 8,
    padding: 8,
  },
  childrenContainer: {
    flexShrink: 1,
  },
})

export default TimetableScreen
