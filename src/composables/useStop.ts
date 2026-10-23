import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import { useShallow } from 'zustand/react/shallow'

import { useFilterStore } from '@/stores'
import type { StopWithBuses } from '@/types/bus'

export const useStop = (stopCode: string | number) => {
  const city = useFilterStore(useShallow((state) => state.city))

  const query = useQuery({
    meta: { persist: true },
    queryFn: () =>
      ky
        .get<StopWithBuses>(`${process.env.EXPO_PUBLIC_BASE_URL}/v1/stop/${stopCode}`, {
          searchParams: {
            city,
          },
        })
        .json(),
    queryKey: ['stop', stopCode],
    staleTime: 86_400_000,
  })

  return {
    query,
  }
}
