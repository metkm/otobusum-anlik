import { useQuery } from '@tanstack/react-query'

import { getPlannedDepartures } from '@/api/getPlannedDepartures'

export const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const

export const useTimetable = (lineCode: string) => {
  const query = useQuery({
    queryKey: [`timetable-${lineCode}`],
    queryFn: () => getPlannedDepartures(lineCode),
  })

  return {
    query,
  }
}
