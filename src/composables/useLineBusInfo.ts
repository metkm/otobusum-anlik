import { useQuery } from '@tanstack/react-query'
import ky from 'ky'

import { LINE_UPDATE_INTERVAL } from '@/constants/app'
import type { BusInfo } from '@/types/bus'
import { useFilterStore } from '@/stores'
import { useShallow } from 'zustand/react/shallow'

export const useLineBusInfo = (doorNo: string) => {
  const city = useFilterStore(useShallow(state => state.city))

  const query = useQuery({
    enabled: city === 'istanbul',
    meta: {
      persist: true,
    },
    queryFn: () =>
      ky.get<BusInfo>(`${process.env.EXPO_PUBLIC_BASE_URL}/v1/bus-info/${doorNo}`, {
        searchParams: {
          city
        }
      }).json(),
    queryKey: ['bus', doorNo, 'info'],
    staleTime: LINE_UPDATE_INTERVAL,
  })

  return {
    query,
  }
}
