import AsyncStorage from '@react-native-async-storage/async-storage'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryCache, QueryClient } from '@tanstack/react-query'

import { notify } from '@/utils/notify'

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

      notify(message)
    },
  }),
})

export const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
})
