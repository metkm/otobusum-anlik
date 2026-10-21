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
  const { camera } = useMap()
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

    camera.current?.flyTo({
      center: [closestBus.lng, closestBus.lat],
      duration: 1000,
      zoom: 13,
    })
  }

  return (
    <View className="flex-row items-center gap-2">
      <UText className="font-inter-medium w-6.5 text-center">{index + 1}</UText>

      <View className="border-muted size-8 items-center justify-center rounded-full border-2">
        {closestBus && (
          <UIcon
            name="bus-front"
            size={16}
          />
        )}
      </View>

      <UText
        className="shrink truncate text-xs"
        numberOfLines={2}
      >
        {item.name}
      </UText>

      <View className="ml-auto flex-row gap-1">
        {closestBus && (
          <>
            <UButton
              icon="locate"
              className="ml-auto"
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

        <UButton
          icon="chevron-right"
          variant="soft"
          to={{ params: { stopCode: item.code }, pathname: `(sheet)/stop/[stopCode]` }}
        />
      </View>
    </View>
  )
}

const COLLAPSED = 112
const EXPANDED = 192

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
      loading={() => <SkeletonLineStops />}
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
        fadingEdgeLength={10}
        contentContainerStyle={{ gap: 4, paddingHorizontal: 8 }}
        // @ts-expect-error
        style={containerStyle}
        onScroll={onScroll}
        keyExtractor={(item) => item.id.toString()}
        scrollEventThrottle={16}
        getFixedItemSize={() => 36}
        recycleItems
      />
    </UQueryState>
  )
}
