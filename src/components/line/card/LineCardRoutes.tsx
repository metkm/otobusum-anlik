import { LegendList, type LegendListRef } from '@legendapp/list/react-native'
import { TrueSheet } from '@lodev09/react-native-true-sheet'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import Animated, { LinearTransition } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { UBadge } from '@/components/u/UBadge'
import { UButton } from '@/components/u/UButton'
import { USheetHeader } from '@/components/u/UHeader'
import { UIcon } from '@/components/u/UIcon'
import { USheet } from '@/components/u/USheet'
import { UText } from '@/components/u/UText'
import { useLine, useLineBuses } from '@/composables'
import { useLineRoutes } from '@/composables/useLineRoutes'
import { useLineStore } from '@/stores'
import type { Route } from '@/types/route'

const RouteItem = ({
  isSelected,
  item,
  busCount,
}: {
  isSelected: boolean
  item: Route
  busCount: number
}) => {
  const setRoute = useLineStore(useShallow((state) => state.setRoute))
  const { code } = useLine()

  const handlePress = () => {
    setRoute(code, item.code)
    void TrueSheet.dismissAll()
  }

  const variant = isSelected ? 'soft' : 'ghost'
  const color = isSelected ? 'primary' : 'neutral'

  return (
    <UButton
      label={item.name}
      onPress={handlePress}
      className="flex-col items-start justify-start"
      variant={variant}
      color={color}
    >
      <View className="flex-row justify-center gap-1">
        <UBadge
          icon="bus-front"
          label={busCount.toString()}
          color={color}
        />

        <UBadge
          label={item.code.split('_').slice(1).join('_')}
          color={color}
        />
      </View>
    </UButton>
  )
}

export const LineCardRoutes = () => {
  const routeSheet = useRef<TrueSheet>(null)
  const scrollableRef = useRef<LegendListRef>(null)

  const changeRouteDirection = useLineStore(useShallow((state) => state.changeRouteDirection))
  const { t } = useTranslation()
  const { code } = useLine()
  const { query: routesQuery, route, routeCode, otherDirectionRoute } = useLineRoutes()
  const { buses, query: busesQuery } = useLineBuses()

  const busCounts = (busesQuery.data?.data ?? []).reduce<Record<string, number>>((acc, bus) => {
    acc[bus.route_code] = (acc[bus.route_code] ?? 0) + 1
    return acc
  }, {})

  const sortedRoutes = [...(routesQuery.data || [])].sort((a, b) => {
    const aBusCount = busCounts[a.code] ?? 0
    const bBusCount = busCounts[b.code] ?? 0

    if (aBusCount !== bBusCount) {
      return bBusCount - aBusCount
    }

    const ad = a.code.split('_')[2]?.slice(1)
    const bd = b.code.split('_')[2]?.slice(1)

    if (!ad && !bd) {
      return 0
    }
    if (!ad) {
      return 1
    }
    if (!bd) {
      return -1
    }

    return Number(ad) - Number(bd)
  })

  return (
    <Animated.View
      layout={LinearTransition}
      className="flex-row items-center gap-2"
    >
      <View className="flex-row items-center gap-1.5 p-2">
        <UIcon
          name="bus-front"
          sizeClassName="size-4.5"
        />
        <UText className="font-inter-semibold text-xs">{buses.length}</UText>
      </View>

      <UButton
        icon="repeat"
        variant="soft"
        disabled={otherDirectionRoute === undefined}
        onPress={() => {
          changeRouteDirection(code)
        }}
      />

      <UButton
        label={route?.name || routeCode}
        variant="soft"
        icon="route"
        onPress={() => void routeSheet.current?.present()}
        disabled={routesQuery.isError}
        block
        className="shrink grow"
        loading={true}
        // Loading={routesQuery.isFetching}
      />

      {routesQuery.data && (
        <USheet
          ref={routeSheet}
          scrollableRef={scrollableRef}
          header={
            <USheetHeader
              icon="route"
              title={t('routes')}
              description={t('routeCount', { count: sortedRoutes.length })}
            />
          }
        >
          <LegendList
            ref={scrollableRef}
            data={sortedRoutes}
            renderItem={({ item }) => (
              <RouteItem
                isSelected={routeCode === item.code}
                item={item}
                busCount={busCounts[item.code] ?? 0}
              />
            )}
            extraData={routeCode}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ gap: 8, padding: 8 }}
            getFixedItemSize={() => 62 + 8}
            recycleItems
          />
        </USheet>
      )}
    </Animated.View>
  )
}
