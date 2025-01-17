import Ionicons from '@react-native-vector-icons/ionicons'
import { FlashList, FlashListProps, ViewToken, ListRenderItem } from '@shopify/flash-list'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { Platform, StyleSheet, View, ViewStyle } from 'react-native'
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'
import { useDebouncedCallback } from 'use-debounce'
import { useShallow } from 'zustand/react/shallow'

import { useMap } from '@/hooks/contexts/useMap'
import { useLine } from '@/hooks/queries/useLine'
import { useLineBusStops } from '@/hooks/queries/useLineBusStops'
import { useTheme } from '@/hooks/useTheme'

import { UiActivityIndicator } from '../../ui/UiActivityIndicator'
import { UiButton } from '../../ui/UiButton'
import { UiText } from '../../ui/UiText'

import { BusLocation } from '@/api/getLineBusLocations'
import { getSelectedRouteCode, useFiltersStore } from '@/stores/filters'
import { getTheme, useLinesStore } from '@/stores/lines'
import { i18n } from '@/translations/i18n'
import { BusStop } from '@/types/bus'

interface LineBusStopsProps {
  lineCode: string
  variant?: 'solid' | 'soft'
}

const AnimatedFlashList
  = Animated.createAnimatedComponent<FlashListProps<BusStop>>(FlashList)

const ITEM_SIZE = 46
const COLLAPSED = ITEM_SIZE * 3 - (ITEM_SIZE / 2) * 2
const EXPANDED = COLLAPSED * 2

export const LineBusStops = ({ lineCode, variant = 'solid' }: LineBusStopsProps) => {
  const routeCode = useFiltersStore(() => getSelectedRouteCode(lineCode))

  const flashlistRef = useAnimatedRef<FlashList<BusStop>>()
  const currentViewableItems = useRef<ViewToken[]>([])
  const currentTrackedBus = useRef<BusLocation>()
  const map = useMap()

  const containerHeight = useSharedValue(COLLAPSED)
  const isScrolling = useSharedValue(false)

  const { query: { data: line } } = useLine(lineCode)

  const lineTheme = useLinesStore(useShallow(() => getTheme(lineCode)))

  const { closestStop, query } = useLineBusStops(routeCode, true)
  const { getSchemeColorHex } = useTheme(lineTheme)

  const busses = useMemo(
    () => line?.filter(bus => bus.route_code === routeCode),
    [line, routeCode],
  )

  const scrollToTrackedBus = useCallback(() => {
    if (!currentTrackedBus.current) return

    const updatedBus = busses?.find(bus => bus.bus_id === currentTrackedBus.current?.bus_id)
    if (!updatedBus) return

    const stopIndex = query.data?.findIndex(stop => stop.stop_code === updatedBus.closest_stop_code)

    if (stopIndex === undefined || stopIndex === -1) {
      currentTrackedBus.current = undefined
    } else {
      flashlistRef.current?.scrollToIndex({
        animated: true,
        index: stopIndex,
        viewPosition: 0.5,
      })
    }
  }, [busses, flashlistRef, query.data])

  const snapToBus = useCallback(() => {
    if (isScrolling.value) return

    const trackedBus = busses?.find((bus) => {
      return currentViewableItems.current.find(({ item }: { item: BusStop }) => {
        return item.stop_code === bus.closest_stop_code
      })
    })

    if (!trackedBus) {
      currentTrackedBus.current = undefined
      containerHeight.value = withDelay(1000, withTiming(COLLAPSED))
    } else {
      currentTrackedBus.current = trackedBus
      containerHeight.value = withTiming(COLLAPSED)

      setTimeout(() => {
        scrollToTrackedBus()
      }, 300)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busses, scrollToTrackedBus])

  const snapToBusDebounced = useDebouncedCallback(snapToBus, 400)

  useEffect(() => {
    if (currentTrackedBus.current || !closestStop || !query.data) return
    const closestIndex = query.data.findIndex(stop => stop.stop_code === closestStop?.stop_code)

    flashlistRef.current?.scrollToIndex({
      animated: true,
      index: closestIndex,
      viewPosition: 0.5,
    })
  }, [closestStop, flashlistRef, query.data])

  useEffect(() => {
    scrollToTrackedBus()
  }, [line, scrollToTrackedBus])

  useAnimatedReaction(
    () => isScrolling.value,
    () => {
      if (!isScrolling.value) {
        runOnJS(snapToBusDebounced)()
      }
    },
    [snapToBus],
  )

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      height: containerHeight.value,
    }
  }, [])

  const color = getSchemeColorHex(variant === 'solid' ? 'onPrimary' : 'onSurface')

  const renderItem: ListRenderItem<BusStop> = useCallback(
    ({ item }) => {
      const closestBus = busses?.find(bus => bus.closest_stop_code === item.stop_code)

      const colorStyle: ViewStyle = {
        borderColor: getSchemeColorHex('primaryContainer'),
        backgroundColor: closestBus ? getSchemeColorHex('primaryContainer') : undefined,
      }

      const handleZoomBus = () => {
        map?.current?.moveTo({
          latitude: item.y_coord,
          longitude: item.x_coord,
        })
      }

      return (
        <View style={styles.item}>
          <View style={styles.itemTitle}>
            <View style={[styles.itemCircle, colorStyle]}>
              {closestBus && (
                <Ionicons
                  name="bus-outline"
                  color={getSchemeColorHex('onPrimaryContainer')}
                  size={20}
                />
              )}
            </View>

            <View style={styles.itemTitleInner}>
              <UiText style={{ color }} numberOfLines={1}>
                {item.stop_name}
              </UiText>

              {closestStop?.stop_code === item.stop_code && (
                <UiText info style={{ color, fontSize: 12 }}>
                  {i18n.t('closeToThisStop')}
                </UiText>
              )}
            </View>
          </View>

          {closestBus && map && (
            <UiButton
              icon="locate"
              onPress={handleZoomBus}
              theme={lineTheme}
            />
          )}
        </View>
      )
    },
    [busses, closestStop?.stop_code, color, getSchemeColorHex, lineTheme, map],
  )

  if (query.isPending) {
    return <UiActivityIndicator />
  }

  const handleScrollDragStart = () => {
    isScrolling.value = true
    containerHeight.value = withTiming(EXPANDED)
  }

  const handleScrollMomentumEnd = () => {
    isScrolling.value = false
  }

  const handleViewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
    currentViewableItems.current = viewableItems
  }

  const overrideItemLayout = (layout: { size?: number }): void => {
    layout.size = ITEM_SIZE
  }

  return (
    <Animated.View style={animatedContainerStyle}>
      <AnimatedFlashList
        ref={flashlistRef}
        data={query.data}
        renderItem={renderItem}
        estimatedItemSize={ITEM_SIZE}
        overrideItemLayout={overrideItemLayout}
        fadingEdgeLength={40}
        onScrollBeginDrag={handleScrollDragStart}
        onMomentumScrollEnd={handleScrollMomentumEnd}
        drawDistance={1}
        {
          ...Platform.OS !== 'web'
            ? {
                onViewableItemsChanged: handleViewableItemsChanged,
              }
            : {}
        }

        // viewabilityConfig={{
        //   minimumViewTime: 200,
        //   waitForInteraction: true,
        //   itemVisiblePercentThreshold: 100,
        // }}
        snapToInterval={ITEM_SIZE}
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
    paddingVertical: 4,
  },
  itemTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  itemTitleInner: {
    flex: 1,
  },
  itemCircle: {
    width: 38,
    height: 38,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
