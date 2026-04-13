import { useQuery } from '@tanstack/react-query'
import ky from 'ky'

import { BusLine, BusStop } from '@/types/bus'

export interface SearchResponse {
  stops: BusStop[]
  lines: BusLine[]
}

export const isStop = (item: BusStop | BusLine): item is BusStop => {
  return (item as BusStop).stop_code !== undefined
}

export const useSearch = (q: string) => {
  const query = useQuery({
    queryKey: ['search', q],
    queryFn: arg => ky.get<SearchResponse>(`${process.env.EXPO_PUBLIC_BASE_URL}/search`, {
      searchParams: {
        q: arg.queryKey[1],
      },
    }).json(),
    enabled: () => q.length > 2,
  })

  return query
}
