import { useQuery } from '@tanstack/react-query'
import ky from 'ky'

import { REFETCH_INTERVAL } from './useLineBuses'

import { BusInfo } from '@/types/bus'

export const useLineBusInfo = (doorNo: string) => {
  const query = useQuery({
    queryKey: ['bus', doorNo, 'info'],
    queryFn: () => ky.get<BusInfo>(`${process.env.EXPO_PUBLIC_BASE_URL}/bus-info/${doorNo}`).json(),
    staleTime: REFETCH_INTERVAL,
    meta: {
      persist: true,
    },
  })

  return {
    query,
  }
}
