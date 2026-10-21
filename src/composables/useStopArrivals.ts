import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import { useShallow } from 'zustand/react/shallow'

import { useFilterStore } from '@/stores'
import type { StopArrival } from '@/types/stop'

export const useStopArrivals = (stopCode: string | number) => {
  const city = useFilterStore(useShallow((state) => state.city))

  const query = useQuery({
    queryFn: () =>
      ky
        .get<StopArrival[]>(`${process.env.EXPO_PUBLIC_BASE_URL}/v1/stop/${stopCode}/arrivals`, {
          searchParams: {
            city,
          },
        })
        .json(),
    queryKey: ['stop', stopCode, 'arrival'],
    refetchInterval: 60_000,
    staleTime: 60_000,
  })

  return {
    query,
  }
}
