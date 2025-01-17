import { useCallback, useRef, useState } from 'react'
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInputChangeEventData,
  View,
  ViewProps,
} from 'react-native'
import { useDebouncedCallback } from 'use-debounce'

import { UiButton } from './ui/UiButton'
import { UiTextInput } from './ui/UiTextInput'

import { i18n } from '@/translations/i18n'

interface Props extends ViewProps {
  isLoading?: boolean
  debounce?: boolean
  onSearch: (query: string) => void
}

export const TheSearchInput = ({ isLoading, debounce, onSearch, style, ...rest }: Props) => {
  const queryValue = useRef('')
  const [queryDisabled, setQueryDisabled] = useState(() => true)

  const handleSearch = useCallback(() => {
    onSearch(queryValue.current)
  }, [onSearch])

  const handleDebouncedSearch = useDebouncedCallback(() => {
    if (!queryValue.current) return
    onSearch(queryValue.current)
  }, 800)

  const handleDebouncedButton = useDebouncedCallback(() => {
    if (!queryValue.current) return
    onSearch(queryValue.current)
  }, 1000)

  const handleQueryChange = useCallback(
    (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
      queryValue.current = event.nativeEvent.text

      if (queryValue.current && queryDisabled === true) {
        setQueryDisabled(false)
      } else if (!queryValue.current && queryDisabled === false) {
        setQueryDisabled(true)
      }

      if (debounce) {
        handleDebouncedSearch()
      }
    },
    [queryDisabled, debounce, handleDebouncedSearch],
  )

  return (
    <View style={[styles.container, style]} {...rest}>
      <UiTextInput
        placeholder="KM-12, KM-12..."
        onChange={handleQueryChange}
        style={styles.input}
        onSubmitEditing={debounce ? handleDebouncedSearch : handleSearch}
        multiline={false}
        returnKeyType="search"
      />

      <UiButton
        title={i18n.t('search')}
        isLoading={isLoading}
        disabled={queryDisabled}
        onPress={debounce ? handleDebouncedButton : handleSearch}
        innerContainerStyle={styles.button}
        icon="search"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 4,
  },
  input: {
    flexGrow: 1,
  },
  button: {
    flexGrow: 1,
  },
})
