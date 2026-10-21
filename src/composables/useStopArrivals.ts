import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import { useShallow } from 'zustand/react/shallow'

import { useFilterStore } from '@/stores'
import { StopArrival } from '@/types/stop'

export const useStopArrivals = (stopCode: string | number) => {
  const city = useFilterStore(useShallow((state) => state.city))

  const query = useQuery({
    queryKey: ['stop', stopCode, 'arrival'],
    queryFn: () =>
      ky
        .get<StopArrival[]>(`${process.env.EXPO_PUBLIC_BASE_URL}/v1/stop/${stopCode}/arrivals`, {
          searchParams: {
            city,
          },
        })
        .json(),
    staleTime: 60_000,
    refetchInterval: 60_000,
  })

  return {
    query,
  }
}
