import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import { useShallow } from 'zustand/react/shallow'

import { useLine } from './useLine'
import { useLineRoutes } from './useLineRoutes'

import { CACHE_MS_2_WEEK } from '@/constants/app'
import { useFilterStore } from '@/stores'
import { BusStop } from '@/types/bus'

export const useLineStops = () => {
  const { code } = useLine()
  const { direction } = useLineRoutes()
  const city = useFilterStore(useShallow(state => state.city))

  const query = useQuery({
    queryKey: ['line', code, 'stops', direction],
    queryFn: () => ky.get<BusStop[]>(`${process.env.EXPO_PUBLIC_BASE_URL}/v1/route-stops/${code}`, {
      searchParams: { direction, city },
    }).json(),
    staleTime: CACHE_MS_2_WEEK,
    meta: { persist: true },
  })

  return {
    query,
  }
}
