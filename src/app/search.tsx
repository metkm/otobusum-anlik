import { useState } from 'react'
import { FlatList, View } from 'react-native'
import { useDebouncedCallback } from 'use-debounce'

import { UButton } from '@/components/u/UButton'
import { UInput } from '@/components/u/UInput'

import { isStop, useSearch } from '@/hooks/useSearch'

export const SearchScreen = () => {
  const [query, setQuery] = useState('')

  const { data } = useSearch(query)

  const handleTextChange = useDebouncedCallback((q: string) => {
    if (q.length < 2)
      return

    setQuery(q)
  }, 250)

  console.log(data)

  return (
    <View className="m-safe p-2 gap-2">
      <UInput
        autoFocus={true}
        placeholder="Search..."
        onChangeText={handleTextChange}
      />

      <FlatList
        data={[
          ...(data?.lines || []),
          ...(data?.stops || []),
        ]}
        renderItem={({ item }) => {
          if (isStop(item)) {
            return (
              <UButton
                label={item.stop_name}
                variant="ghost"
                color="neutral"
              />
            )
          }

          return (
            <UButton
              label={item.title}
              variant="ghost"
              color="neutral"
            />
          )
        }}
        keyExtractor={item => isStop(item) ? item.id.toString() : item.code}
        contentContainerClassName="gap-2"
      />
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
