import { TrueSheet } from '@lodev09/react-native-true-sheet'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, ListRenderItem, View } from 'react-native'
import Animated, { LinearTransition } from 'react-native-reanimated'
import { useShallow } from 'zustand/react/shallow'

import { UButton } from '@/components/u/UButton'
import { UIcon } from '@/components/u/UIcon'
import { USheet } from '@/components/u/USheet'
import { UText } from '@/components/u/UText'

import { useLine, useLineBuses, useLineTheme } from '@/composables'
import { LineRoute, useLineRoutes } from '@/composables/useLineRoutes'
import { useLineStore } from '@/stores'

const RouteItem = ({ isSelected, item }: { isSelected: boolean, item: LineRoute }) => {
  const setRoute = useLineStore(useShallow(state => state.setRoute))
  const { code } = useLine()
  const { query: busesQuery } = useLineBuses()

  const theme = useLineTheme()
  const color = theme?.text({ variant: isSelected ? 'solid' : 'ghost' })

  return (
    <UButton
      label={item.name}
      variant={isSelected ? 'solid' : 'ghost'}
      color="neutral"
      onPress={() => setRoute(code, item.code)}
      className="flex-col justify-start items-start"
    >
      <View className="flex-row justify-center gap-1">
        <View className="px-2 py-1 gap-1 rounded-md flex-row items-center">
          <UIcon
            name="bus-front"
            sizeClassName="size-4"
            color={color?.color}
          />

          <UText
            className="font-inter-medium text-xs"
            style={color}
          >
            {busesQuery.data?.reduce((acc, curr) => curr.route_code === item.code ? acc + 1 : acc, 0)}
          </UText>
        </View>

        <UText
          className="px-2 py-1 font-inter-medium rounded-md text-xs align-middle"
          style={color}
        >
          {item.code.split('_').slice(1).join('_')}
        </UText>
      </View>
    </UButton>
  )
}

export const LineCardRoutes = () => {
  const routeSheet = useRef<TrueSheet>(null)

  const { t } = useTranslation()
  const { code } = useLine()
  const { query: routesQuery, route, routeCode, otherDirectionRoute } = useLineRoutes()
  const changeRouteDirection = useLineStore(useShallow(state => state.changeRouteDirection))

  const sortedRoutes = [...(routesQuery.data || [])]
    .sort((a, b) => {
      const ad = a.code.split('_')[2]?.slice(1)
      const bd = b.code.split('_')[2]?.slice(1)

      if (!ad || !bd)
        return 1

      return Number(ad) - Number(bd)
    })

  const presentRoutes = () => {
    routeSheet.current?.present()
  }

  const renderItem: ListRenderItem<LineRoute> = ({ item }) => {
    return (
      <RouteItem
        isSelected={routeCode === item.code}
        item={item}
      />
    )
  }

  return (
    <Animated.View layout={LinearTransition} className="flex-row items-center gap-2">
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
        onPress={presentRoutes}
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
            <FlatList
              data={sortedRoutes}
              renderItem={renderItem}
              extraData={routeCode}
              contentContainerClassName="px-2 pt-2 gap-2"
            />
          </USheet>
        )}
    </Animated.View>
  )
}
