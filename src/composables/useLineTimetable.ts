import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import { useShallow } from 'zustand/react/shallow'

import { useLine } from './useLine'
import { useLineRoutes } from './useLineRoutes'

import { CACHE_MS_2_WEEK } from '@/constants/app'
import { useFilterStore } from '@/stores'

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
  const city = useFilterStore(useShallow(state => state.city))

  const query = useQuery({
    queryKey: ['timetable', code, direction],
    queryFn: () => ky.get<Timetable>(`${process.env.EXPO_PUBLIC_BASE_URL}/timetable/${code}`, {
      searchParams: {
        direction,
        city,
      },
    }).json(),
    staleTime: CACHE_MS_2_WEEK,
    meta: { persist: true },
  })

  return {
    query,
  }
}
