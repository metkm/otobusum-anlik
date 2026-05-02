import { useQuery } from '@tanstack/react-query'
import ky from 'ky'

import { useLine } from './useLine'
import { useLineRoutes } from './useLineRoutes'

import { CACHE_MS_1_MONTH } from '@/constants/app'
import { BusStop } from '@/types/bus'

export const useLineStops = () => {
  const { code } = useLine()
  const { direction } = useLineRoutes()

  const query = useQuery({
    queryKey: ['line', code, 'stops', direction],
    queryFn: () => ky.get<BusStop[]>(`${process.env.EXPO_PUBLIC_BASE_URL}/v1/route-stops/${code}`, {
      searchParams: { direction },
    }).json(),
    staleTime: CACHE_MS_1_MONTH,
    meta: { persist: true },
  })

  return {
    query,
  }
}
