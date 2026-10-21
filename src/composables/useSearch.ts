import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import { useShallow } from 'zustand/react/shallow'

import { useFilterStore } from '@/stores'
import type { BusLine, BusStop } from '@/types/bus'

export interface SearchResponse {
  stops: BusStop[]
  lines: BusLine[]
}

export const isStop = (item: BusStop | BusLine): item is BusStop =>
  (item as BusStop).lng !== undefined

export const MIN_CHARACTER_LIMIT = 1

export const useSearch = (q: string) => {
  const city = useFilterStore(useShallow((state) => state.city))

  const query = useQuery({
    enabled: () => q.length > MIN_CHARACTER_LIMIT,
    queryFn: (arg) =>
      ky
        .get<SearchResponse>(`${process.env.EXPO_PUBLIC_BASE_URL}/v1/search`, {
          searchParams: {
            city,
            q: arg.queryKey[1],
          },
        })
        .json(),
    queryKey: ['search', q],
  })

  return { query }
}
