import { useQuery } from '@tanstack/react-query'
import ky from 'ky'

import { BusStopWithBuses } from '@/types/bus'

export const useStop = (stopCode: string | number) => {
  const query = useQuery({
    queryKey: ['stop', stopCode],
    queryFn: () => ky.get<BusStopWithBuses>(`${process.env.EXPO_PUBLIC_BASE_URL}/v1/stop/${stopCode}`).json(),
    staleTime: 86_400_000,
    meta: { persist: true },
  })

  return {
    query,
  }
}
