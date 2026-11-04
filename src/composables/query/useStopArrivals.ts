import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import { useShallow } from 'zustand/react/shallow'

import { MS_60_SECONDS } from '@/constants/time'
import { useFilterStore } from '@/stores'
import { type StopArrival } from '@/types/stop'
import { getNextPollDelay } from '@/utils/query'

export const useStopArrivals = (stopCode: string | number) => {
  const city = useFilterStore(useShallow((state) => state.city))

  const query = useQuery({
    enabled: () => city === 'istanbul',
    queryFn: async () => ({
      data: await ky
        .get<StopArrival[]>(`${process.env.EXPO_PUBLIC_BASE_URL}/v1/stop/${stopCode}/arrivals`, {
          searchParams: {
            city,
          },
        })
        .json(),
    }),
    queryKey: ['stop', 'arrival', stopCode, city],
    refetchInterval: (query) => getNextPollDelay(query.state, MS_60_SECONDS),
    staleTime: MS_60_SECONDS,
  })

  return {
    query,
  }
}
