import { ComponentProps, useCallback, useEffect } from 'react'
import {
  FlatList,
  LayoutChangeEvent,
  ListRenderItem,
  Platform,
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
import { useShallow } from 'zustand/react/shallow'

import { LineTimetableMemoized } from '@/components/lines/line/LineTimetable'
import { Lines } from '@/components/lines/Lines'
import { UiText } from '@/components/ui/UiText'

import { usePaddings } from '@/hooks/usePaddings'

import { useFiltersStore } from '@/stores/filters'
import { getLines, useLinesStore } from '@/stores/lines'
import { useMiscStore } from '@/stores/misc'
import { i18n } from '@/translations/i18n'

const FlatListComponent = Platform.OS === 'web' ? FlatList : Animated.FlatList

export const TimetableScreen = () => {
  const { tabRoutePaddings } = usePaddings(0)

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
      const mx = Math.max(0, Math.min(useMiscStore.getState().scrolledLineIndex, lines.length - 1))

      linesRef.current?.scrollToIndex({
        index: mx,
        viewPosition: 0.5,
      })
    }, 200)
  }, [linesRef, lines.length])

  const containerStyle: StyleProp<ViewStyle> = {
    flex: 1,
    ...tabRoutePaddings,
  }

  const handleOnScroll = useAnimatedScrollHandler(({ contentOffset }) => {
    scrollTo(linesRef, contentOffset.x, 0, false)
    scrollTo(timetablesRef, contentOffset.x, 0, false)
  })

  const renderItem: ListRenderItem<string> = useCallback(({ item: lineCode }) => {
    return <LineTimetableMemoized lineCode={lineCode} />
  }, [])

  const keyExtractor = useCallback((item: string) => item, [])

  if (lines.length < 1) {
    return <UiText style={styles.center}>{i18n.t('timetableEmpty')}</UiText>
  }

  return (
    <View style={containerStyle}>
      <Lines
        ref={linesRef}
        listProps={{
          onLayout,
          onScroll: Platform.OS !== 'web' ? handleOnScroll : undefined,
        }}
        lineProps={{
          variant: 'soft',
        }}
      />

      <FlatListComponent
        ref={timetablesRef}
        data={lines}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        onScroll={Platform.OS !== 'web' ? handleOnScroll : undefined}
        pagingEnabled
        snapToAlignment="center"
        horizontal
        removeClippedSubviews={false}
        {...(Platform.OS === 'web'
          ? ({
              CellRendererComponent: ({ children }) => {
                return <View style={{ flex: 1 }}>{children}</View>
              },
            } as Pick<ComponentProps<typeof FlatList<string>>, 'CellRendererComponent'>)
          : ({} as any))}
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
    flex: 1,
  },
  listContent: {
    gap: 8,
    padding: 8,
    paddingTop: 0,
  },
})

export default TimetableScreen
