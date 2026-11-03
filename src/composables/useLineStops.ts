import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import { useShallow } from 'zustand/react/shallow'

import { useFilterStore } from '@/stores'
import type { Stop } from '@/types/bus'

import { useLine } from './useLine'
import { useLineRoutes } from './useLineRoutes'
import { MS_3_DAYS } from '@/constants/time'

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
    queryKey: ['route', 'stops', code, direction, city],
    staleTime: MS_3_DAYS,
  })

  return {
    query,
  }
}
