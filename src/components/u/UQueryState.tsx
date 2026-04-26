import { UseQueryResult, DefaultError } from '@tanstack/react-query'
import React from 'react'

import { UActivityIndicator } from './UActivityIndicator'
import { UText } from './UText'

export const UQueryState = <T,>({
  query,
  loading,
  error,
  children,
}: {
  query: UseQueryResult<T>
  loading?: () => React.ReactNode
  error?: (error: DefaultError) => React.ReactNode
  children?: React.ReactNode
}) => {
  if (query.isFetching)
    return loading?.() ?? <UActivityIndicator />

  if (query.isError)
    return error?.(query.error) ?? (
      <UText className="text-error grow text-center align-middle text-xs truncate shrink" numberOfLines={1}>
        {query.error.message}
      </UText>
    )

  return children
}
