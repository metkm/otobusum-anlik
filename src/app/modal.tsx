import { FlashList } from '@shopify/flash-list'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { NativeSyntheticEvent, StyleSheet, TextInputChangeEventData, View } from 'react-native'
import { useDebouncedCallback } from 'use-debounce'

import { TheSearchItem } from '@/components/TheSearchItem'
import { UiActivityIndicator } from '@/components/ui/UiActivityIndicator'
import { UiChip } from '@/components/ui/UiChip'
import { UiErrorContainer } from '@/components/ui/UiErrorContainer'
import { UiText } from '@/components/ui/UiText'
import { UiTextInput } from '@/components/ui/UiTextInput'

import { usePaddings } from '@/hooks/usePaddings'

import { getSearchResults } from '@/api/getSearchResults'
import { useFiltersStore } from '@/stores/filters'
import { i18n } from '@/translations/i18n'
import { BusLine, BusStop } from '@/types/bus'

export const ModalScreen = () => {
  const paddings = usePaddings()
  const selectedCity = useFiltersStore(state => state.selectedCity)

  const mutation = useMutation({
    mutationFn: getSearchResults,
  })

  const handleSearch = useDebouncedCallback((q: string) => {
    mutation.mutate(q)
  }, 500)

  const data = useMemo(
    () => [...(mutation.data?.lines || []), ...(mutation.data?.stops || [])],
    [mutation.data?.lines, mutation.data?.stops],
  )

  const renderItem = useCallback(
    ({ item }: { item: BusLine | BusStop }) => <TheSearchItem item={item} />,
    [],
  )

  const EmptyItem = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        {mutation.error
          ? (
              <UiErrorContainer message={mutation.error?.message || ''} />
            )
          : mutation.data
            ? (
                <UiText info style={styles.empty}>
                  {i18n.t('emptySearch')}
                </UiText>
              )
            : mutation.isPending
              ? (
                  <UiActivityIndicator size="large" />
                )
              : (
                  <UiText info style={styles.empty}>
                    {i18n.t('searchMessage')}
                  </UiText>
                )}
      </View>
    ),
    [mutation.data, mutation.isPending, mutation.error],
  )

  const handleQueryChange = useCallback(
    (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
      const text = event.nativeEvent.text
      if (!text) return

      handleSearch(text)
    },
    [handleSearch],
  )

  return (
    <View style={[paddings, styles.container]}>
      <UiChip>{i18n.t('selectedCity', { city: selectedCity })}</UiChip>

      <View style={{ flex: 1 }}>
        <UiTextInput
          placeholder={i18n.t('searchPlaceholder')}
          icon="search"
          autoFocus
          onChange={handleQueryChange}
        />

        <View style={styles.list}>
          {data.length < 1
            ? (
                EmptyItem
              )
            : (
                <FlashList
                  data={data}
                  renderItem={renderItem}
                  estimatedItemSize={45}
                  fadingEdgeLength={20}
                  contentContainerStyle={styles.contentStyle}
                  keyboardDismissMode="on-drag"
                />
              )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentStyle: {
    paddingTop: 4,
  },
  container: {
    flex: 1,
    gap: 8,
  },
  list: {
    flex: 1,
  },
})

export default ModalScreen
