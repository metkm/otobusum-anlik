import { router } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { UButton } from '@/components/u/UButton'
import { UInput } from '@/components/u/UInput'
import { UQueryState } from '@/components/u/UQueryState'
import { UText } from '@/components/u/UText'

import { useLineTheme } from '@/composables'
import { LineContext } from '@/composables/useLine'
import { isStop, MIN_CHARACTER_LIMIT, useSearch } from '@/composables/useSearch'
import { useFilterStore, useLineStore } from '@/stores'
import { BusLine, BusStop } from '@/types/bus'

const RenderItemLine = ({ item }: { item: BusLine }) => {
  const addLine = useLineStore(useShallow(state => state.addLine))
  const theme = useLineTheme()

  const backgroundWithColor = theme?.backgroundWithColor({ variant: 'solid' })

  return (
    <View className="flex-row items-stretch gap-2 shrink">
      <UButton
        variant="ghost"
        color="neutral"
        label={item.name}
        onPress={() => {
          addLine(item.code)
        }}
        className="flex-1"
      >
        <UText
          className="bg-muted rounded-md px-2.5 py-1 font-inter-medium"
          style={backgroundWithColor}
        >
          {item.code}
        </UText>
      </UButton>

      <UButton
        icon="circle-plus"
        to={{
          pathname: '/groups',
          params: { addToGroup: item.code },
        }}
        variant="soft"
        size="lg"
      />
    </View>
  )
}

const RenderItemStop = ({ item }: { item: BusStop }) => {
  return (
    <UButton
      variant="ghost"
      color="neutral"
      label={item.name}
      icon="bus-front"
    />
  )
}

export const SearchScreen = () => {
  const [query, setQuery] = useState('')
  const city = useFilterStore(useShallow(state => state.city))
  const { t } = useTranslation()

  const { query: searchQuery } = useSearch(query)
  const results = [
    ...(searchQuery.data?.lines || []),
    ...(searchQuery.data?.stops || []),
  ]

  const neededCharacterCount = MIN_CHARACTER_LIMIT - query.length + 1

  return (
    <View className="grow m-safe gap-2">
      <View className="flex-row gap-2 mt-2 mx-2">
        <UButton
          icon="arrow-left"
          block
          variant="soft"
          className="aspect-square"
          onPress={() => router.back()}
        />

        <UInput
          autoFocus={true}
          placeholder={t('searchPlaceholder')}
          onChangeText={q => setQuery(q)}
          loading={searchQuery.isFetching}
          icon="search"
          containerClassName="grow"
        />
      </View>

      <UText className="text-center text-muted font-inter-medium text-xs">{t('selectedCity', { city })}</UText>

      {neededCharacterCount > 0 && (
        <UText className="text-center text-muted font-inter-medium text-xs">
          {t('neededCharacterCountToSearch', { count: neededCharacterCount })}
        </UText>
      )}

      <UQueryState query={searchQuery}>
        {(results.length < 1 && searchQuery.isSuccess)
          ? (
              <UText className="text-muted font-inter-medium  grow text-center align-middle">{t('emptySearch')}</UText>
            )
          : (
              <FlatList
                data={results}
                renderItem={({ item }) => {
                  if (isStop(item)) {
                    return <RenderItemStop item={item} />
                  }

                  return (
                    <LineContext value={item.code}>
                      <RenderItemLine item={item} />
                    </LineContext>
                  )
                }}
                className="flex-1"
                contentContainerClassName="px-2 gap-2"
                fadingEdgeLength={10}
              />
            )}
      </UQueryState>
    </View>
  )
}

export default SearchScreen
