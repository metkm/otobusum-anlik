import { useQuery } from '@tanstack/react-query'
import ky from 'ky'

import { useLine } from './useLine'

import { BusStop } from '@/types/bus'

export const useLineStops = () => {
  const { code } = useLine()

  const query = useQuery({
    queryKey: ['line', code, 'stops'],
    queryFn: () => ky.get<BusStop[]>(`${process.env.EXPO_PUBLIC_BASE_URL}/v1/route-stops/${code}`, {
      searchParams: { direction: 'G' },
    }).json(),
    staleTime: Infinity,
    meta: { persist: true },
  })

  return {
    query,
  }
}
