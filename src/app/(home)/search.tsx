import { router } from 'expo-router'
import { useState } from 'react'
import { FlatList, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { UButton } from '@/components/u/UButton'
import { UInput } from '@/components/u/UInput'
import { UQueryState } from '@/components/u/UQueryState'
import { UText } from '@/components/u/UText'

import { useLineTheme } from '@/composables'
import { LineContext } from '@/composables/useLine'
import { isStop, MIN_CHARACTER_LIMIT, useSearch } from '@/composables/useSearch'
import { useLineStore } from '@/stores'
import { i18n } from '@/translations/i18n'
import { BusLine, BusStop } from '@/types/bus'

const RenderItemLine = ({ item }: { item: BusLine }) => {
  const addLine = useLineStore(useShallow(state => state.addLine))
  const theme = useLineTheme()

  const backgroundWithColor = theme?.backgroundWithColor({ variant: 'solid' })

  return (
    <View className="flex-row items-center gap-2 shrink">
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
          className="bg-muted rounded-md px-2.5 py-1 text-sm font-medium"
          style={backgroundWithColor}
        >
          {item.code}
        </UText>
      </UButton>

      <UButton
        icon="circle-plus"
        to={{ pathname: '/groups',
          params: { addToGroup: item.code } }}
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

  const { query: searchQuery } = useSearch(query)
  const results = [
    ...(searchQuery.data?.lines || []),
    ...(searchQuery.data?.stops || []),
  ]

  const neededCharacterCount = MIN_CHARACTER_LIMIT - query.length + 1

  return (
    <View className="grow m-safe p-2 gap-2">
      <View className="flex-row gap-2">
        <UButton
          icon="arrow-left"
          block
          variant="soft"
          className="aspect-square"
          onPress={() => router.back()}
        />

        <UInput
          autoFocus={true}
          placeholder={i18n.t('searchPlaceholder')}
          onChangeText={q => setQuery(q)}
          loading={searchQuery.isFetching}
          icon="search"
          className="flex-1"
        />
      </View>

      {neededCharacterCount > 0 && (
        <UText className="text-center text-muted font-medium text-xs">
          {`${neededCharacterCount} more characters are needed for search`}
        </UText>
      )}

      <UQueryState query={searchQuery}>

        {(results.length < 1 && searchQuery.isSuccess)
          ? (
              <UText className="text-muted font-medium  grow text-center align-middle">{i18n.t('emptySearch')}</UText>
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
                contentContainerClassName="gap-2"
                fadingEdgeLength={10}
              />
            )}
      </UQueryState>
    </View>
  )
}

export default SearchScreen

// import { useMutation } from '@tanstack/react-query'
// import { router } from 'expo-router'
// import { useCallback, useMemo } from 'react'
// import { NativeSyntheticEvent, StyleSheet, TextInputChangeEventData, View } from 'react-native'
// import { FlatList } from 'react-native-gesture-handler'
// import { useDebouncedCallback } from 'use-debounce'

// import { TheSearchItem } from '@/components/TheSearchItem'
// import { UiActivityIndicator } from '@/components/ui/UiActivityIndicator'
// import { UiChip } from '@/components/ui/UiChip'
// import { UiErrorContainer } from '@/components/ui/UiErrorContainer'
// import { UiText } from '@/components/ui/UiText'
// import { UiTextInput } from '@/components/ui/UiTextInput'

// import { usePaddings } from '@/hooks/usePaddings'

// import { getSearchResults } from '@/api/getSearchResults'
// import { useFiltersStore } from '@/stores/filters'
// import { i18n } from '@/translations/i18n'
// import { BusLine, BusStop } from '@/types/bus'

// export const ModalScreen = () => {
//   const { modalRoutePaddings } = usePaddings()
//   const selectedCity = useFiltersStore(state => state.selectedCity)

//   const mutation = useMutation({
//     mutationFn: getSearchResults,
//   })

//   const handleSearch = useDebouncedCallback((q: string) => {
//     mutation.mutate(q)
//   }, 500)

//   const data = useMemo(
//     () => [...(mutation.data?.lines || []), ...(mutation.data?.stops || [])],
//     [mutation.data?.lines, mutation.data?.stops],
//   )

//   const renderItem = useCallback(
//     ({ item }: { item: BusLine | BusStop }) => <TheSearchItem item={item} />,
//     [],
//   )

//   const EmptyItem = useMemo(
//     () => (
//       <View style={styles.emptyContainer}>
//         {mutation.error
//           ? (
//               <UiErrorContainer message={mutation.error?.message || ''} />
//             )
//           : mutation.data
//             ? (
//                 <UiText style={styles.empty}>
//                   {i18n.t('emptySearch')}
//                 </UiText>
//               )
//             : mutation.isPending
//               ? (
//                   <UiActivityIndicator size="large" />
//                 )
//               : (
//                   <UiText style={styles.empty}>
//                     {i18n.t('searchMessage')}
//                   </UiText>
//                 )}
//       </View>
//     ),
//     [mutation.data, mutation.isPending, mutation.error],
//   )

//   const handleQueryChange = useCallback(
//     (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
//       const text = event.nativeEvent.text
//       if (!text) return

//       handleSearch(text)
//     },
//     [handleSearch],
//   )

//   return (
//     <View style={[modalRoutePaddings, styles.container]}>
//       <UiTextInput
//         placeholder={i18n.t('searchPlaceholder')}
//         icon="arrow-back"
//         iconPress={() => router.back()}
//         styleContainer={{ elevation: 2 }}
//         autoFocus
//         onChange={handleQueryChange}
//       />

//       <UiChip>{i18n.t('selectedCity', { city: selectedCity })}</UiChip>

//       <View style={styles.list}>
//         {data.length < 1
//           ? (
//               EmptyItem
//             )
//           : (
//               <FlatList
//                 data={data}
//                 renderItem={renderItem}
//                 fadingEdgeLength={20}
//                 contentContainerStyle={styles.contentStyle}
//                 keyboardDismissMode="on-drag"
//               />
//             )}
//       </View>
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   empty: {
//     flex: 1,
//     textAlign: 'center',
//     textAlignVertical: 'center',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   contentStyle: {
//     paddingTop: 4,
//   },
//   container: {
//     flex: 1,
//     gap: 8,
//   },
//   list: {
//     flex: 1,
//   },
// })

// export default ModalScreen
