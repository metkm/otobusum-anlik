import { LegendList } from '@legendapp/list/react-native'
import { TrueSheet } from '@lodev09/react-native-true-sheet'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import Animated, { LinearTransition } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { UButton } from '@/components/u/UButton'
import { UIcon } from '@/components/u/UIcon'
import { USheet } from '@/components/u/USheet'
import { UText } from '@/components/u/UText'

import { useLine, useLineBuses, useLineTheme } from '@/composables'
import { LineRoute, useLineRoutes } from '@/composables/useLineRoutes'
import { useLineStore } from '@/stores'

const RouteItem = ({ isSelected, item, busCount }: { isSelected: boolean, item: LineRoute, busCount: number }) => {
  const setRoute = useLineStore(useShallow(state => state.setRoute))
  const { code } = useLine()

  const theme = useLineTheme()
  const backgroundWithColor = theme?.backgroundWithColor({ variant: isSelected ? 'solid' : 'soft' })

  return (
    <UButton
      label={item.name}
      variant={isSelected ? 'solid' : 'ghost'}
      color="neutral"
      onPress={() => setRoute(code, item.code)}
      className="flex-col justify-start items-start h-15.5"
    >
      <View className="flex-row justify-center gap-1">
        <View className="px-2 py-1 gap-1 rounded-md flex-row items-center" style={backgroundWithColor}>
          <UIcon
            name="bus-front"
            sizeClassName="size-4"
            color={backgroundWithColor?.color}
          />

          <UText
            className="font-inter-medium text-xs"
            style={backgroundWithColor}
          >
            {busCount}
          </UText>
        </View>

        <UText
          className="px-2 py-1 font-inter-medium rounded-md text-xs align-middle"
          style={backgroundWithColor}
        >
          {item.code.split('_').slice(1).join('_')}
        </UText>
      </View>
    </UButton>
  )
}

export const LineCardRoutes = () => {
  const routeSheet = useRef<TrueSheet>(null)

  const changeRouteDirection = useLineStore(useShallow(state => state.changeRouteDirection))
  const { t } = useTranslation()
  const { code } = useLine()
  const { query: routesQuery, route, routeCode, otherDirectionRoute } = useLineRoutes()
  const { buses, query: busesQuery } = useLineBuses()

  const busCounts = (busesQuery.data ?? [])
    .reduce<Record<string, number>>(
      (acc, bus) => {
        acc[bus.route_code] = (acc[bus.route_code] ?? 0) + 1
        return acc
      },
      {},
    )

  const sortedRoutes = [...(routesQuery.data || [])]
    .sort((a, b) => {
      const aBusCount = busCounts[a.code] ?? 0
      const bBusCount = busCounts[b.code] ?? 0

      if (aBusCount !== bBusCount) {
        return bBusCount - aBusCount
      }

      const ad = a.code.split('_')[2]?.slice(1)
      const bd = b.code.split('_')[2]?.slice(1)

      if (!ad && !bd) return 0
      if (!ad) return 1
      if (!bd) return -1

      return Number(ad) - Number(bd)
    })

  return (
    <Animated.View
      layout={LinearTransition}
      className="flex-row items-center gap-2"
    >
      <View className="flex-row items-center gap-1.5 p-2">
        <UIcon name="bus-front" colorClassName="text-default" />
        <UText className="text-xs font-inter-medium">{buses.length}</UText>
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
        color="neutral"
        icon="route"
        onPress={() => {
          routeSheet.current?.present()
        }}
        block
        className="grow shrink"
        loading={routesQuery.isFetching}
      />

      {routesQuery.data
        && (
          <USheet
            ref={routeSheet}
            scrollable
            detents={[0.5, 1]}
            header={(
              <View className="p-2 pt-5 border-b border-muted">
                <UText className="text-lg font-inter-semibold leading-tight">{t('routes')}</UText>
              </View>
            )}
            contentContainerClassName="pt-0"
          >
            <LegendList
              data={sortedRoutes}
              renderItem={({ item }) => (
                <RouteItem
                  isSelected={routeCode === item.code}
                  item={item}
                  busCount={busCounts[item.code] ?? 0}
                />
              )}
              extraData={routeCode}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={{ paddingHorizontal: 8, paddingTop: 8, gap: 8 }}
              getFixedItemSize={() => 62 + 8}
              recycleItems
            />
          </USheet>
        )}
    </Animated.View>
  )
}
