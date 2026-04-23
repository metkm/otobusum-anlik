import { useQuery } from '@tanstack/react-query'
import ky from 'ky'

import { useLine } from './useLine'
import { useLineRoutes } from './useLineRoutes'

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
    staleTime: 60_000 * 30,
    meta: { persist: true },
  })

  return {
    query,
  }
}
