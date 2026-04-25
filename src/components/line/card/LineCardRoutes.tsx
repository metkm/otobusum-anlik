import { TrueSheet } from '@lodev09/react-native-true-sheet'
import { useRef } from 'react'
import { FlatList, ListRenderItem, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { UButton } from '@/components/u/UButton'
import { USheet } from '@/components/u/USheet'
import { UText } from '@/components/u/UText'

import { useLine, useLineTheme } from '@/composables'
import { LineRoute, useLineRoutes } from '@/composables/useLineRoutes'
import { useLineStore } from '@/stores'

const RouteItem = ({ isSelected, item }: { isSelected: boolean, item: LineRoute }) => {
  const setRoute = useLineStore(useShallow(state => state.setRoute))
  const { code } = useLine()
  const theme = useLineTheme(code)

  return (
    <UButton
      label={item.name}
      variant="ghost"
      onPress={() => setRoute(code, item.code)}
    >
      <UText
        className="px-2 py-1 font-medium rounded-md w-20 text-center"
        style={{
          backgroundColor: isSelected ? theme?.['ui-primary'] : theme?.['ui-bg-muted'],
          color: isSelected ? theme?.['ui-text-inverted'] : theme?.['ui-text'],
        }}
      >
        {item.code.split('_').slice(1).join('_')}
      </UText>
    </UButton>
  )
}

export const LineCardRoutes = () => {
  const routeSheet = useRef<TrueSheet>(null)

  const { code } = useLine()
  const { query: routesQuery, route, routeCode, otherDirectionRoute } = useLineRoutes()
  const changeRouteDirection = useLineStore(useShallow(state => state.changeRouteDirection))

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
        color="neutral"
        icon="route"
        onPress={presentRoutes}
        block
        className="grow shrink"
      />

      {routesQuery.data
        && (
          <USheet
            ref={routeSheet}
            scrollable
            detents={[0.5, 1]}
          >
            <FlatList
              data={routesQuery.data}
              renderItem={renderItem}
              contentContainerClassName="gap-2"
              extraData={routeCode}
            />
          </USheet>
        )}
    </View>
  )
}
