import { CapacitorHttp } from '@capacitor/core'
import { useQuery } from '@tanstack/vue-query'
import type { BusStop, BusLine } from '~/types/bus'

export interface SearchResponse {
  stops: BusStop[]
  lines: BusLine[]
}

export const SEARCH_KEY_LIMIT = 1

export const isStop = (item: BusStop | BusLine): item is BusStop => {
  return (item as BusStop).code !== undefined
}

export const useSearch = (q: MaybeRef<string>) => {
  const runtimeConfig = useRuntimeConfig()

  const query = useQuery({
    queryKey: ['search', () => toValue(q)],
    queryFn: () =>
      CapacitorHttp.get({
        url: `${runtimeConfig.public.baseUrl}/v1/search`,
        params: {
          q: toValue(q),
        },
      }).then(response => response.data as SearchResponse),
    enabled: () => toValue(q).length > SEARCH_KEY_LIMIT,
  })

  return query
}
