import AsyncStorage from '@react-native-async-storage/async-storage'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryCache, QueryClient } from '@tanstack/react-query'
import { ToastAndroid } from 'react-native'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1_000 * 60 * 60 * 12,
    },
  },
  queryCache: new QueryCache({
    onError: (_, query) => {
      let message = query.meta?.errorMessage as string | undefined
      if (!message) return

      ToastAndroid.show(message, ToastAndroid.TOP)
    },
  }),
})

export const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
})
