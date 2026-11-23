import { AnimatedLegendList } from '@legendapp/list/reanimated'
import { type LocationObject, getCurrentPositionAsync } from 'expo-location'
import { Link } from 'expo-router'
import { t } from 'i18next'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { UButton, UEmpty, UIcon, UQueryState, UText } from '@/components/u'
import { SkeletonLineStops } from '@/components/u/skeleton/SkeletonLineStops'
import { useExpandableCardHeight, useMap } from '@/composables'
import { useLineBuses, useLineStops } from '@/composables/query'
import { LayoutAnimationTransition } from '@/constants/animation'
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
  const { easeTo } = useMap()
  const { query: lineStopsQuery } = useLineStops()

  const hideMap = useSettingsStore(useShallow((state) => state.hideMap))

  const closestBus = buses.find((bus) => {
    if (!lineStopsQuery.data) {
      return false
    }

    const closestStop = getClosestPoint(bus, lineStopsQuery.data)
    return closestStop?.id && closestStop.id === item.id
  })

  const goToBus = () => {
    if (closestBus) {
      easeTo({ lat: closestBus.lat, lng: closestBus.lng })
    }
  }

  return (
    <View className="shrink flex-row items-center gap-2">
      <Link
        href={{ params: { stopCode: item.code }, pathname: `/(sheet)/stop/[stopCode]` }}
        asChild
      >
        <UButton
          className="flex-1"
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
      </Link>

      {closestBus && (
        <>
          {!hideMap && (
            <UButton
              icon="locate-fixed"
              variant="soft"
              onPress={goToBus}
            />
          )}

          <Link
            href={{
              params: {
                doorNo: closestBus.bus_id,
              },
              pathname: '/(sheet)/bus-info/[doorNo]',
            }}
            asChild
          >
            <UButton
              icon="info"
              variant="soft"
              className="mr-2"
            />
          </Link>
        </>
      )}
    </View>
  )
}

export const LineCardStops = () => {
  const showMyLocation = useSettingsStore(useShallow((state) => state.showMyLocation))
  const [location, setLocation] = useState<LocationObject>()
  const { query: lineStopsQuery } = useLineStops()
  const { onScroll } = useExpandableCardHeight()

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
        // @ts-expect-error
        layout={LayoutAnimationTransition}
        data={lineStopsQuery.data || []}
        renderItem={({ item, index }) => (
          <StopItem
            item={item}
            index={index}
            closestToUser={closestStopToUser && item.id === closestStopToUser.id}
          />
        )}
        ItemSeparatorComponent={() => (
          <UIcon
            name="chevron-down"
            colorClassName="accent-(--ui-border)"
            sizeClassName="size-3.5"
            className="absolute -bottom-1.5 left-13.25"
          />
        )}
        className="border-b-hairline border-b-muted flex-1"
        keyExtractor={(item) => item.id.toString()}
        scrollEventThrottle={16}
        getFixedItemSize={() => 48}
        recycleItems
        showsVerticalScrollIndicator={false}
        drawDistance={0}
        onScroll={onScroll}
      />
    </UQueryState>
  )
}
