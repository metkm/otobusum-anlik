import { AnimatedLegendList } from '@legendapp/list/reanimated'
import { t } from 'i18next'
import { View } from 'react-native'
import {
  LinearTransition,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { SkeletonLineStops } from '@/components/u/skeleton/SkeletonLineStops'
import { UButton } from '@/components/u/UButton'
import { UEmpty } from '@/components/u/UEmpty'
import { UIcon } from '@/components/u/UIcon'
import { UQueryState } from '@/components/u/UQueryState'
import { UText } from '@/components/u/UText'
import { useLineBuses, useLineStops, useMap } from '@/composables'
import { useSettingsStore } from '@/stores'
import type { BusStop } from '@/types/bus'
import { getClosestPoint } from '@/utils/getClosestPoint'

const StopItem = ({ item, index }: { item: BusStop; index: number }) => {
  const { buses } = useLineBuses()
  const { flyTo } = useMap()
  const { query: lineStopsQuery } = useLineStops()

  const closestBus = buses.find((bus) => {
    if (!lineStopsQuery.data) {
      return false
    }

    const closestStop = getClosestPoint(bus, lineStopsQuery.data)
    return closestStop?.id && closestStop.id === item.id
  })

  const goToBus = () => {
    if (!closestBus) {
      return
    }

    flyTo({
      center: [closestBus.lng, closestBus.lat],
    })
  }

  return (
    <View className="shrink flex-row items-center gap-2 pr-3">
      <UButton
        className="flex-1"
        to={{ params: { stopCode: item.code }, pathname: `(sheet)/stop/[stopCode]` }}
        variant="ghost"
        trailingIcon="chevron-right"
        label={item.name}
        labelClassName="text-default"
      >
        <UText className="font-inter-medium text-muted w-6.5 text-center">{index + 1}</UText>

        <View className="outline-muted mx-1 size-7 items-center justify-center rounded-full outline-2 outline-offset-2">
          <UIcon
            name={closestBus ? 'bus-front' : 'map-pin'}
            colorClassName={closestBus ? 'text-primary' : 'text-muted/15'}
            sizeClassName="size-4"
          />
        </View>
      </UButton>

      {closestBus && (
        <>
          <UButton
            icon="locate-fixed"
            variant="soft"
            onPress={goToBus}
          />

          <UButton
            icon="info"
            to={{
              params: {
                doorNo: closestBus.bus_id,
              },
              pathname: '(sheet)/bus-info/[doorNo]',
            }}
            variant="soft"
          />
        </>
      )}
    </View>
  )
}

const ONE_ITEM = 48
const PADDING = 6 * 2
const COLLAPSED = ONE_ITEM * 3 + PADDING
const EXPANDED = ONE_ITEM * 4 + PADDING

export const LineCardStops = () => {
  const expandStopsWhenScrolled = useSettingsStore(
    useShallow((state) => state.expandStopsWhenScrolled),
  )
  const { query: lineStopsQuery } = useLineStops()
  const containerHeight = useSharedValue(COLLAPSED)

  const containerStyle = useAnimatedStyle(() => ({
    height: containerHeight.value,
  }))

  const onScroll = useAnimatedScrollHandler({
    onBeginDrag: () => {
      if (!expandStopsWhenScrolled) {
        return
      }
      containerHeight.set(EXPANDED)
    },
    onMomentumEnd: () => {
      if (!expandStopsWhenScrolled && containerHeight.value !== EXPANDED) {
        return
      }
      containerHeight.set(withDelay(1500, withTiming(COLLAPSED)))
    },
  })

  if (lineStopsQuery.data && lineStopsQuery.data.length < 1) {
    return (
      <UEmpty
        title={t('emptyStops')}
        icon="bus"
        className="grow"
      />
    )
  }

  return (
    <UQueryState
      query={lineStopsQuery}
      fetching={() => <SkeletonLineStops />}
    >
      <AnimatedLegendList
        layout={LinearTransition}
        data={lineStopsQuery.data || []}
        renderItem={({ item, index }) => (
          <StopItem
            item={item}
            index={index}
          />
        )}
        contentContainerClassName="py-1.5"
        // @ts-expect-error
        style={containerStyle}
        onScroll={onScroll}
        keyExtractor={(item) => item.id.toString()}
        scrollEventThrottle={16}
        GetFixedItemSize={() => 48}
        recycleItems
      />
    </UQueryState>
  )
}
