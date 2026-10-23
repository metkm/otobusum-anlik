import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import { useShallow } from 'zustand/react/shallow'

import { useFilterStore } from '@/stores'
import type { Line, Stop } from '@/types/bus'

export interface SearchResponse {
  stops: Stop[]
  lines: Line[]
}

export const isStop = (item: Stop | Line): item is Stop => (item as Stop).lng !== undefined

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
