import { getSearchResults, SearchResult } from '@/api/getSearchResults'
import { TheSearchInput } from '@/components/TheSearchInput'
import { TheSearchItem } from '@/components/TheSearchItem'
import { UiActivityIndicator } from '@/components/ui/UiActivityIndicator'

import { UiText } from '@/components/ui/UiText'
import { i18n } from '@/translations/i18n'
import { FlashList } from '@shopify/flash-list'
import { useMutation } from '@tanstack/react-query'

import { useCallback, useMemo } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function Search() {
  const insets = useSafeAreaInsets()

  const mutation = useMutation({
    mutationFn: getSearchResults,
  })

  const onSearch = useCallback(
    (q: string) => {
      mutation.mutate(q)
    },
    [mutation],
  )

  const data = useMemo(
    () => mutation.data?.list.filter(i => i.Stationcode === 0),
    [mutation.data],
  )

  const renderItem = useCallback(
    ({ item }: { item: SearchResult }) => <TheSearchItem item={item} />,
    [],
  )

  const emptyItem = useCallback(() => {
    if (mutation.data) {
      return <UiText style={styles.empty}>{i18n.t('emptySearch')}</UiText>
    }

    if (mutation.isPending) {
      return <UiActivityIndicator size={34} />
    }

    return <UiText style={styles.empty}>{i18n.t('searchSomething')}</UiText>
  }, [mutation.data, mutation.isPending])

  const extraPadding = 8
  const paddings: StyleProp<ViewStyle> = {
    paddingTop: insets.top + extraPadding,
    paddingBottom: insets.bottom + extraPadding,
    paddingLeft: insets.left + extraPadding,
    paddingRight: insets.right + extraPadding,
  }

  return (
    <View style={[styles.container, paddings]}>
      <TheSearchInput
        onSearch={onSearch}
        isLoading={mutation.isPending}
        style={{ marginBottom: 8 }}
        debounce
      />

      <View style={styles.list}>
        <FlashList
          data={data}
          renderItem={renderItem}
          estimatedItemSize={45}
          fadingEdgeLength={20}
          contentContainerStyle={{ paddingVertical: 8 }}
          keyboardDismissMode="on-drag"
          ListEmptyComponent={emptyItem}
        />
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
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
})
