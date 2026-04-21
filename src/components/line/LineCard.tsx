import { TrueSheet } from '@lodev09/react-native-true-sheet'
import { useRef } from 'react'
import { View, ViewProps, FlatList } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { UText } from '@/components/u/UText'

import { UActivityIndicator } from '../u/UActivityIndicator'
import { UButton } from '../u/UButton'
import { USheet } from '../u/USheet'

import { useCountdown } from '@/composables/useCountdown'
import { useLine } from '@/composables/useLine'
import { useLineBuses } from '@/composables/useLineBuses'
import { useLineRoutes } from '@/composables/useLineRoutes'
import { useLineStops } from '@/composables/useLineStops'
import { useLineTheme } from '@/composables/useLineTheme'
import { LINE_UPDATE_INTERVAL } from '@/constants/app'
import { useFilterStore } from '@/stores/filter'
import { useLineStore } from '@/stores/line'
import { cn } from '@/utils/cn'

export const LineCard = ({ className, style, ...props }: ViewProps) => {
  const deleteLine = useLineStore(useShallow(state => state.deleteLine))
  const toggleLineHidden = useFilterStore(useShallow(state => state.toggleLineHidden))
  const setRoute = useLineStore(useShallow(state => state.setRoute))

  const { code } = useLine()
  const { query: lineQuery } = useLineBuses()
  const { query: routesQuery, route, routeCode } = useLineRoutes()
  const { query: lineStopsQuery } = useLineStops()

  const { remaining } = useCountdown(lineQuery.dataUpdatedAt, LINE_UPDATE_INTERVAL)
  const theme = useLineTheme(code)

  const menuSheet = useRef<TrueSheet>(null)
  const routeSheet = useRef<TrueSheet>(null)

  const presentMenu = () => {
    menuSheet.current?.present()
  }

  const presentRoutes = () => {
    routeSheet.current?.present()
  }

  return (
    <View
      className={cn('bg-default p-2 rounded-md gap-2', className)}
      style={[{ backgroundColor: theme?.['ui-bg'] }, style]}
      {...props}
    >
      <View className="flex-row items-center justify-between pl-2">
        <View className="flex-row items-center gap-2 shrink">
          <UText className="font-semibold text-lg">{code}</UText>

          {
            lineQuery.isFetching
              ? <UActivityIndicator color={theme?.['ui-primary']} />
              : lineQuery.error
                ? <UText className="text-error truncate shrink" numberOfLines={1}>{lineQuery.error.message}</UText>
                : <UText className="text-xs text-muted">{`${remaining} sec to update`}</UText>
          }
        </View>

        <View className="flex-row gap-2">
          <UButton
            icon="eye"
            onPress={() => toggleLineHidden(code)}
            variant="ghost"
            color="neutral"
          />

          <UButton
            icon="menu"
            onPress={presentMenu}
            variant="ghost"
            color="neutral"
          />
        </View>

        <USheet
          ref={menuSheet}
          detents={['auto']}
          contentContainerClassName="px-2 gap-2"
        >
          <UButton
            label="Add to group"
            icon="circle-plus"
            square
            size="lg"
            block
            variant="soft"
            color="primary"
          />

          <UButton
            label="Delete line"
            color="neutral"
            icon="trash-2"
            square
            onPress={() => deleteLine(code)}
            size="lg"
            block
            variant="soft"
          />
        </USheet>
      </View>

      <FlatList
        data={lineStopsQuery.data || []}
        renderItem={({ item }) => (
          <View className="flex-row items-center gap-2">
            <View
              className="size-10 rounded-full border-2 border-muted"
              style={{ borderColor: theme?.['ui-primary'] }}
            />
            <UText className="text-xs">{item.name}</UText>
          </View>
        )}
        className="max-h-24"
        contentContainerClassName="px-2 gap-2"
        fadingEdgeLength={10}
      />

      <UButton
        label={route?.name || routeCode}
        variant="soft"
        color="neutral"
        block
        onPress={presentRoutes}
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
              renderItem={({ item }) => (
                <UButton
                  label={item.name}
                  variant="ghost"
                  square
                  onPress={() => setRoute(code, item.code)}
                >
                  <UText
                    className="px-2 py-1 font-medium rounded-md w-20 text-center"
                    style={{
                      backgroundColor: routeCode === item.code ? theme?.['ui-primary'] : theme?.['ui-bg-muted'],
                      color: routeCode === item.code ? theme?.['ui-text-inverted'] : theme?.['ui-text'],
                    }}
                  >
                    {item.code.split('_').slice(1).join('_')}
                  </UText>
                </UButton>
              )}
              contentContainerClassName="gap-2"
            />
          </USheet>
        )}
    </View>
  )
}
