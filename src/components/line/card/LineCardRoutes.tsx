import { TrueSheet } from '@lodev09/react-native-true-sheet'
import { useRef } from 'react'
import { FlatList, ListRenderItem, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { StyledLucide, UButton } from '@/components/u/UButton'
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
  const backgroundWithColor = theme?.backgroundWithColor({ variant: isSelected ? 'solid' : 'soft' })

  return (
    <UButton
      label={item.name}
      variant="soft"
      onPress={() => setRoute(code, item.code)}
      className="flex-col justify-start items-start"
    >
      <View className="flex-row justify-center gap-1">
        <View
          className="px-2 py-1 gap-1 rounded-md flex-row"
          style={backgroundWithColor}
        >
          <StyledLucide
            name="bus-front"
            sizeClassName="size-4"
            color={backgroundWithColor?.color}
          />

          <UText
            className="font-medium text-xs"
            style={backgroundWithColor}
          >
            {busesQuery.data?.reduce((acc, curr) => curr.route_code === item.code ? acc + 1 : acc, 0)}
          </UText>
        </View>

        <UText
          className="px-2 py-1 font-medium rounded-md text-xs"
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
    <View className="flex-row gap-2 grow">
      <UButton
        icon="repeat"
        disabled={otherDirectionRoute === undefined}
        onPress={() => {
          changeRouteDirection(code)
        }}
      />

      <UButton
        label={route?.name || routeCode}
        variant="soft"
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
          >
            <FlatList
              data={sortedRoutes}
              renderItem={renderItem}
              extraData={routeCode}
              contentContainerClassName="gap-2 px-2 pb-2"
            />
          </USheet>
        )}
    </View>
  )
}
