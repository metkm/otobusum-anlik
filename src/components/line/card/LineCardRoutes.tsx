import { LegendList, type LegendListRef } from '@legendapp/list/react-native'
import { TrueSheet } from '@lodev09/react-native-true-sheet'
import { t } from 'i18next'
import { useRef } from 'react'
import { View } from 'react-native'
import { Path, Svg } from 'react-native-svg'
import { useCSSVariable } from 'uniwind'
import { useShallow } from 'zustand/react/shallow'

import { UBadge, UButton, USheet } from '@/components/u'
import { useGroupItem } from '@/composables'
import { useLineBuses, useLineRoutes } from '@/composables/query'
import { useTransitStore } from '@/stores'
import type { Route } from '@/types/route'
import { latLngToSvgPath } from '@/utils/latLngToSvgPath'

const ROUTE_PATH_WIDTH = 82
const ROUTE_PATH_HEIGHT = 52

const RouteItem = ({
  isSelected,
  item,
  busCount,
}: {
  isSelected: boolean
  item: Route
  busCount: number
}) => {
  const setRoute = useTransitStore(useShallow((state) => state.setRoute))
  const { code } = useGroupItem()
  const colorPrimary = useCSSVariable('--color-primary')

  const handlePress = () => {
    setRoute(code, item.code)
    void TrueSheet.dismissAll()
  }

  const badgeVariant = isSelected ? 'soft' : 'outline'
  const variant = isSelected ? 'soft' : 'ghost'
  const color = isSelected ? 'primary' : 'neutral'

  const [from, to] = item.name.split('-')

  const d = item.path ? latLngToSvgPath(item.path, ROUTE_PATH_WIDTH, ROUTE_PATH_HEIGHT) : ''

  return (
    <UButton
      label={item.name}
      onPress={handlePress}
      variant={variant}
      color={color}
      className="shrink"
    >
      <View className="shrink grow flex-row items-center justify-between gap-2">
        <View className="shrink">
          <View className="flex-row items-center">
            <UButton.Text>{from}</UButton.Text>
            <UButton.Icon name="arrow-right" />
            <UButton.Text>{to}</UButton.Text>
          </View>

          <UButton.Text className="text-xs opacity-75">
            {item.code.split('_').slice(1).join('_')}
          </UButton.Text>
        </View>

        <UBadge
          icon="bus-front"
          label={busCount.toString()}
          variant={badgeVariant}
          color={color}
        />

        <Svg
          width={ROUTE_PATH_WIDTH}
          height={ROUTE_PATH_HEIGHT}
        >
          <Path
            d={d}
            stroke={colorPrimary}
            fill="transparent"
          />
        </Svg>
      </View>
    </UButton>
  )
}

export const LineCardRoutes = () => {
  const routeSheet = useRef<TrueSheet>(null)
  const scrollableRef = useRef<LegendListRef>(null)

  const changeRouteDirection = useTransitStore(useShallow((state) => state.changeRouteDirection))

  const { code } = useGroupItem()
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
    <View className="flex-row items-center gap-2 p-2">
      <UBadge
        icon="bus-front"
        label={buses.length.toString()}
        variant="soft"
      />

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
        loading={routesQuery.isFetching}
      />

      {routesQuery.data && (
        <USheet
          ref={routeSheet}
          scrollableRef={scrollableRef}
        >
          <UBadge
            label={t('routes')}
            icon="route"
            variant="ghost"
            className="mr-auto mb-2 ml-2"
          />

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
            contentContainerClassName="px-2"
            getFixedItemSize={() => 72}
            recycleItems
          />
        </USheet>
      )}
    </View>
  )
}
