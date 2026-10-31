import { AnimatedLegendList } from '@legendapp/list/reanimated'
import { type LocationObject, getCurrentPositionAsync } from 'expo-location'
import { t } from 'i18next'
import { useEffect, useState } from 'react'
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
import type { Stop } from '@/types/bus'
import { getClosestPoint } from '@/utils/getClosestPoint'

const StopItem = ({
  item,
  index,
  closestToUser,
}: {
  item: Stop
  index: number
  closestToUser?: boolean
}) => {
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
    <View className="shrink flex-row items-center gap-2">
      <UButton
        className="flex-1"
        to={{ params: { stopCode: item.code }, pathname: `(sheet)/stop/[stopCode]` }}
        variant="ghost"
        trailingIcon="chevron-right"
      >
        <UText className="font-inter-medium text-muted w-6.5 text-center">{index + 1}</UText>

        <View className="outline-muted mx-1 size-7 items-center justify-center rounded-full outline-2 outline-offset-2">
          <UIcon
            name={closestBus ? 'bus-front' : 'map-pin'}
            colorClassName={closestBus ? 'accent-primary' : 'accent-muted/15'}
            sizeClassName="size-4"
          />
        </View>

        <View className="shrink">
          <UText
            className="font-inter-medium shrink text-sm"
            numberOfLines={1}
          >
            {item.name}
          </UText>

          {closestToUser && (
            <UText
              className="text-primary shrink text-xs"
              numberOfLines={1}
            >
              {t('userClosestToThisStop')}
            </UText>
          )}
        </View>
      </UButton>

      {closestBus && (
        <View className="flex-row gap-2 pr-2">
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
        </View>
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
  const showMyLocation = useSettingsStore(useShallow((state) => state.showMyLocation))
  const [location, setLocation] = useState<LocationObject>()
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

  useEffect(() => {
    if (!showMyLocation) {
      return
    }

    const getCurrentLocation = async () => {
      const lc = await getCurrentPositionAsync()
      setLocation(lc)
    }

    void getCurrentLocation()
  }, [showMyLocation])

  if (lineStopsQuery.data && lineStopsQuery.data.length < 1) {
    return (
      <UEmpty
        title={t('emptyStops')}
        icon="bus"
        className="grow"
      />
    )
  }

  const closestStopToUser =
    location && lineStopsQuery.data
      ? getClosestPoint(
          { lat: location.coords.latitude, lng: location.coords.longitude },
          lineStopsQuery.data,
        )
      : undefined

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
            closestToUser={closestStopToUser && item.id === closestStopToUser.id}
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
        showsVerticalScrollIndicator={false}
      />
    </UQueryState>
  )
}
