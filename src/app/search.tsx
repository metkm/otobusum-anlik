import { useState } from 'react'
import { FlatList, View } from 'react-native'
import { useDebouncedCallback } from 'use-debounce'
import { useShallow } from 'zustand/react/shallow'

import { UButton } from '@/components/u/UButton'
import { UInput } from '@/components/u/UInput'
import { UText } from '@/components/u/UText'

import { isStop, useSearch } from '@/composables/useSearch'
import { useLineStore } from '@/stores/line'

export const SearchScreen = () => {
  const [query, setQuery] = useState('')
  const addLine = useLineStore(useShallow(state => state.addLine))

  const {
    query: { data, error, isFetching, isSuccess },
  } = useSearch(query)
  const items = [...(data?.lines || []), ...(data?.stops || [])]

  const handleTextChange = useDebouncedCallback((q: string) => {
    if (q.length < 2) return

    setQuery(q)
  }, 250)

  return (
    <View className="grow m-safe p-2 gap-2">
      <UInput
        autoFocus={true}
        placeholder="Search..."
        onChangeText={handleTextChange}
        loading={isFetching}
        icon="search"
      />

      {items.length > 1
        ? (
            <FlatList
              data={items}
              renderItem={({ item }) => {
                return (
                  <UButton
                    label={item.name}
                    variant="ghost"
                    color="neutral"
                    onPress={() => {
                      if (isStop(item)) return

                      addLine(item.code)
                    }}
                  >
                    <UText className="bg-muted rounded-md p-2">{item.code}</UText>
                  </UButton>
                )
              }}
            />
          )
        : (
            <View className="grow justify-center items-center">
              {error
                ? <UText className="text-error">{error.message}</UText>
                : isSuccess
                  ? <UText>No results found!</UText>
                  : <UText>Search Something</UText>}
            </View>
          )}
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
