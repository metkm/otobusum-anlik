import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import ky from 'ky'
import { useShallow } from 'zustand/react/shallow'

import { useMap } from './useMap'

import { useFilterStore } from '@/stores'
import { TransitNearby } from '@/types/transit'

export const useTransitNearby = (options?: Omit<UseQueryOptions<TransitNearby>, 'queryKey' | 'queryFn'>) => {
  const city = useFilterStore(useShallow(state => state.city))
  const map = useMap()

  const query = useQuery({
    queryKey: ['transit', 'nearby'],
    queryFn: async () => {
      const center = await map.map.current?.getCenter()

      return ky.get<TransitNearby>(`${process.env.EXPO_PUBLIC_BASE_URL}/v1/transit/nearby`, {
        searchParams: {
          city,
          lat: center?.[1],
          lng: center?.[0],
        },
      }).json()
    },
    // staleTime: 'static',
    ...options,
  })

  return {
    query,
  }
}
