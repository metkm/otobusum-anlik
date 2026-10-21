import { useQuery } from '@tanstack/react-query'
import ky from 'ky'

import { LINE_UPDATE_INTERVAL } from '@/constants/app'
import type { BusInfo } from '@/types/bus'

export const useLineBusInfo = (doorNo: string) => {
  const query = useQuery({
    meta: {
      persist: true,
    },
    queryFn: () => ky.get<BusInfo>(`${process.env.EXPO_PUBLIC_BASE_URL}/bus-info/${doorNo}`).json(),
    queryKey: ['bus', doorNo, 'info'],
    staleTime: LINE_UPDATE_INTERVAL,
  })

  return {
    query,
  }
}
