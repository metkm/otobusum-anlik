import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import { useShallow } from 'zustand/react/shallow'

import { useFilterStore } from '@/stores'
import { TransitNearby } from '@/types/transit'

export const useTransitNearby = (lat?: number, lng?: number) => {
  const city = useFilterStore(useShallow((state) => state.city))

  const query = useQuery({
    queryKey: ['transit', 'nearby', lat, lng],
    queryFn: async () => {
      return ky
        .get<TransitNearby>(`${process.env.EXPO_PUBLIC_BASE_URL}/v1/transit/nearby`, {
          searchParams: {
            city,
            lat,
            lng,
          },
        })
        .json()
    },
    enabled: () => lat !== undefined && lng !== undefined,
  })

  return {
    query,
  }
}
