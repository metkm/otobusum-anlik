import AsyncStorage from '@react-native-async-storage/async-storage'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryCache, QueryClient } from '@tanstack/react-query'

export const queryCache = new QueryCache()

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1_000 * 60 * 60 * 12,
    },
  },
  queryCache,
})

export const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
})
