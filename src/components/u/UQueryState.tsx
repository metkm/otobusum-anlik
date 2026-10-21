import type { UseQueryResult, DefaultError } from '@tanstack/react-query'
import { View } from 'react-native'

import { UActivityIndicator } from './UActivityIndicator'
import { UText } from './UText'

export const UQueryState = <T,>({
  query,
  loading,
  error,
  errorMessage,
  children,
}: {
  query: UseQueryResult<T>
  loading?: () => React.ReactNode
  error?: (error: DefaultError) => React.ReactNode
  errorMessage?: string
  children?: React.ReactNode
}) => {
  if (query.isPending) return loading?.() ?? <UActivityIndicator />

  if (query.isError) {
    return (
      error?.(query.error) ?? (
        <View>
          <UText
            className="text-error shrink grow truncate p-2 text-center align-middle text-xs"
            numberOfLines={1}
          >
            {errorMessage ?? query.error.message}
          </UText>

          <View></View>
        </View>
      )
    )
  }

  return children
}
