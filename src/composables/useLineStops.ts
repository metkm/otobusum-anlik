import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import { useShallow } from 'zustand/react/shallow'

import { CACHE_MS_3_DAYS } from '@/constants/app'
import { useFilterStore } from '@/stores'
import type { Stop } from '@/types/bus'

import { useLine } from './useLine'
import { useLineRoutes } from './useLineRoutes'

export const useLineStops = () => {
  const { code } = useLine()
  const { direction } = useLineRoutes()
  const city = useFilterStore(useShallow((state) => state.city))

  const query = useQuery({
    meta: { persist: true },
    queryFn: () =>
      ky
        .get<Stop[]>(`${process.env.EXPO_PUBLIC_BASE_URL}/v1/route-stops/${code}`, {
          searchParams: { city, direction },
        })
        .json(),
    queryKey: ['line', code, 'stops', direction],
    staleTime: CACHE_MS_3_DAYS,
  })

  return {
    query,
  }
}
