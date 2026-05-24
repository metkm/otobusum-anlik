import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import { useShallow } from 'zustand/react/shallow'

import { useFilterStore } from '@/stores'
import { BusStopWithBuses } from '@/types/bus'

export const useStop = (stopCode: string | number) => {
  const city = useFilterStore(useShallow(state => state.city))

  const query = useQuery({
    queryKey: ['stop', stopCode],
    queryFn: () => ky.get<BusStopWithBuses>(`${process.env.EXPO_PUBLIC_BASE_URL}/v1/stop/${stopCode}`, {
      searchParams: {
        city,
      },
    }).json(),
    staleTime: 86_400_000,
    meta: { persist: true },
  })

  return {
    query,
  }
}
