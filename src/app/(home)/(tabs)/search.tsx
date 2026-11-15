import { LegendList } from '@legendapp/list/react-native'
import { router } from 'expo-router'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type TextInputInstance, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useDebounce } from 'use-debounce'
import { useShallow } from 'zustand/react/shallow'

import { queryClient } from '@/api/client'
import { ThemeProvider } from '@/components/provider/ThemeProvider'
import { UBadge, UButton, UEmpty, UInput, UQueryState, UText } from '@/components/u'
import { useMap } from '@/composables'
import {
  busesQueryOptions,
  routesQueryOptions,
  getDefaultRouteCode,
  useSearch,
} from '@/composables/query'
import { MIN_CHARACTER_LIMIT, isStop } from '@/composables/query/useSearch'
import { GroupItemContext } from '@/composables/useGroupItem'
import { useFilterStore, useTransitStore } from '@/stores'
import type { Line, Stop } from '@/types/bus'
import { getLatLngBounds } from '@/utils/bounds'

const RenderItemLine = ({ item }: { item: Line }) => {
  const addItemToGroup = useTransitStore(useShallow((state) => state.addItemToGroup))
  const city = useFilterStore(useShallow((state) => state.city))
  const { fitBounds, easeTo } = useMap()

  const addLineAndZoom = async () => {
    addItemToGroup({ code: item.code, type: 'line' })

    const routes = await queryClient.query(routesQueryOptions(item.code, city))
    const path = routes.find((route) => route.code === getDefaultRouteCode(item.code))?.path

    if (path) {
      const bounds = getLatLngBounds(path)
      if (bounds) {
        fitBounds(bounds)
        return
      }
    }

    const buses = await queryClient.query(busesQueryOptions(item.code, city))
    const bus = buses.data.at(0)

    if (bus) {
      easeTo({ lat: bus.lat, lng: bus.lng })
    }
  }

  return (
    <View className="shrink flex-row items-stretch gap-2">
      <UButton
        variant="ghost"
        color="neutral"
        label={item.name}
        onPress={addLineAndZoom}
        className="flex-1"
      >
        <UBadge label={item.code} />
      </UButton>

      <UButton
        icon="circle-plus"
        to={{
          params: { code: item.code, type: 'line' },
          pathname: '/(sheet)/groups',
        }}
        variant="soft"
        size="lg"
      />
    </View>
  )
}

const RenderItemStop = ({ item }: { item: Stop }) => (
  <View className="shrink flex-row items-center gap-2">
    <UButton
      variant="ghost"
      color="neutral"
      label={item.name}
      to={{ params: { stopCode: item.code }, pathname: `/(sheet)/stop/[stopCode]` }}
      className="flex-1"
    >
      <UBadge icon="map-pin" />
    </UButton>

    <UButton
      icon="circle-plus"
      to={{
        params: { code: item.code, type: 'stop' },
        pathname: '/(sheet)/groups',
      }}
      variant="soft"
      size="lg"
    />
  </View>
)

export const SearchScreen = () => {
  const [query, setQuery] = useState('')
  const city = useFilterStore(useShallow((state) => state.city))
  const inputRef = useRef<TextInputInstance>(null)
  const { t } = useTranslation()

  const [debouncedQuery] = useDebounce(query, 500)
  const { query: searchQuery } = useSearch(debouncedQuery)

  const clearQuery = () => {
    setQuery('')
    inputRef.current?.clear()
  }

  const results = [...(searchQuery.data?.lines || []), ...(searchQuery.data?.stops || [])]
  const neededCharacterCount = MIN_CHARACTER_LIMIT - query.length + 1

  return (
    <View className="m-safe grow">
      <View className="mx-2 mt-2 flex-row gap-2">
        <UButton
          icon="arrow-left"
          block
          variant="soft"
          size="lg"
          className="aspect-square"
          onPress={() => router.back()}
        />

        <UInput
          ref={inputRef}
          autoFocus
          placeholder={t('searchPlaceholder')}
          onChangeText={(q) => setQuery(q)}
          loading={searchQuery.isFetching}
          variant="soft"
          icon="search"
          containerClassName="grow"
        >
          {query.length > MIN_CHARACTER_LIMIT && (
            <GestureHandlerRootView style={{ position: 'absolute', right: 4 }}>
              <UButton
                icon="x"
                variant="ghost"
                color="neutral"
                onPress={clearQuery}
              />
            </GestureHandlerRootView>
          )}
        </UInput>
      </View>

      <View className="border-b-hairline border-b-muted flex-row flex-wrap items-center gap-2 p-2">
        {neededCharacterCount > 0 && (
          <UText className="text-muted font-inter-medium text-center text-sm">
            {t('neededCharacterCountToSearch', { count: neededCharacterCount })}
          </UText>
        )}

        <UBadge
          label={city}
          variant="soft"
          color="neutral"
          className="ml-auto"
        />
      </View>

      <UQueryState query={searchQuery}>
        {results.length < 1 && searchQuery.isSuccess ? (
          <UEmpty
            title={t('noResults')}
            description={t('noResultsDescription')}
            icon="search"
            className="m-2 grow"
          />
        ) : (
          <LegendList
            data={results}
            renderItem={({ item }) => {
              if (isStop(item)) {
                return <RenderItemStop item={item} />
              }

              return (
                <GroupItemContext value={item.code}>
                  <ThemeProvider>
                    <RenderItemLine item={item} />
                  </ThemeProvider>
                </GroupItemContext>
              )
            }}
            keyExtractor={(item) => item.id.toString()}
            className="flex-1"
            contentContainerStyle={{ gap: 8, padding: 8 }}
            recycleItems
          />
        )}
      </UQueryState>
    </View>
  )
}

export default SearchScreen
