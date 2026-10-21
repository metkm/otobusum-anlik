import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import { useShallow } from 'zustand/react/shallow'

import { useFilterStore } from '@/stores'
import type { TransitNearby } from '@/types/transit'

export const useTransitNearby = (lat?: number, lng?: number) => {
  const city = useFilterStore(useShallow((state) => state.city))

  const query = useQuery({
    enabled: () => lat !== undefined && lng !== undefined,
    queryFn: async () =>
      ky
        .get<TransitNearby>(`${process.env.EXPO_PUBLIC_BASE_URL}/v1/transit/nearby`, {
          searchParams: {
            city,
            lat,
            lng,
          },
        })
        .json(),
    queryKey: ['transit', 'nearby', lat, lng],
  })

  return {
    query,
  }
}
