import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import { useShallow } from 'zustand/react/shallow'

import { MS_60_SECONDS } from '@/constants/time'
import { useFilterStore } from '@/stores'
import type { BusInfo } from '@/types/bus'

export const useLineBusInfo = (doorNo: string) => {
  const city = useFilterStore(useShallow((state) => state.city))

  const query = useQuery({
    enabled: city === 'istanbul',
    queryFn: () =>
      ky
        .get<BusInfo>(`${process.env.EXPO_PUBLIC_BASE_URL}/v1/bus-info/${doorNo}`, {
          searchParams: {
            city,
          },
        })
        .json(),
    queryKey: ['bus', 'info', doorNo, city],
    staleTime: MS_60_SECONDS,
  })

  return {
    query,
  }
}
