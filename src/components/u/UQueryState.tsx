import type { DefaultError, UseQueryResult } from '@tanstack/react-query'
import { View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { cn } from '@/utils/cn'

import { UActivityIndicator } from './UActivityIndicator'
import { UButton } from './UButton'
import { UText } from './UText'

export const UQueryState = <T,>({
  query,
  fetching,
  error,
  errorMessage,
  children,
  className,
}: {
  query: UseQueryResult<T>
  fetching?: () => React.ReactNode
  error?: (error: DefaultError) => React.ReactNode
  errorMessage?: string
  children?: React.ReactNode
  className?: string
}) => {
  if (query.isFetching) {
    return fetching?.() ?? <UActivityIndicator />
  }

  if (query.isError) {
    return (
      error?.(query.error) ?? (
        <View
          className={cn(
            'bg-error/15 border-error/25 gap-2 rounded-md border-2 p-2 grow items-center justify-center',
            className,
          )}
        >
          <UText className="text-error font-inter-medium shrink truncate text-center text-sm">
            {errorMessage ?? query.error.message}
          </UText>

          <GestureHandlerRootView style={{ flexShrink: 0 }}>
            <UButton
              label="Retry"
              color="error"
              block
              loading={query.isFetching}
              onPress={() => {
                void query.refetch()
              }}
              icon="repeat"
            />
          </GestureHandlerRootView>
        </View>
      )
    )
  }

  return children
}
