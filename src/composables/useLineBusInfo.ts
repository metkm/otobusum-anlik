import { useQuery } from '@tanstack/react-query'
import ky from 'ky'

import { LINE_UPDATE_INTERVAL } from '@/constants/app'
import { BusInfo } from '@/types/bus'

export const useLineBusInfo = (doorNo: string) => {
  const query = useQuery({
    queryKey: ['bus', doorNo, 'info'],
    queryFn: () => ky.get<BusInfo>(`${process.env.EXPO_PUBLIC_BASE_URL}/bus-info/${doorNo}`).json(),
    staleTime: LINE_UPDATE_INTERVAL,
    meta: {
      persist: true,
    },
  })

  return {
    query,
  }
}
