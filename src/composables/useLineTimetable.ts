import { useQuery } from '@tanstack/react-query'
import ky from 'ky'

import { useLine } from './useLine'
import { useLineRoutes } from './useLineRoutes'

import { CACHE_MS_1_MONTH } from '@/constants/app'

export type Time = `${number}:${number}:${number}`

interface Timetable {
  sunday: Time[]
  monday: Time[]
  tuesday: Time[]
  wednesday: Time[]
  thursday: Time[]
  friday: Time[]
  saturday: Time[]
}

export const useLineTimetable = () => {
  const { direction } = useLineRoutes()
  const { code } = useLine()

  const query = useQuery({
    queryKey: ['timetable', code, direction],
    queryFn: () => ky.get<Timetable>(`${process.env.EXPO_PUBLIC_BASE_URL}/timetable/${code}`, {
      searchParams: {
        direction,
      },
    }).json(),
    staleTime: CACHE_MS_1_MONTH,
    meta: { persist: true },
  })

  return {
    query,
  }
}
