import { useSuspenseQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { getAllRoutes } from '@/api/getAllRoutes'
import { getSelectedRouteCode, useFiltersStore } from '@/stores/filters'

export function useRoutes(lineCode: string) {
  const routeCode = useFiltersStore(useShallow(() => getSelectedRouteCode(lineCode)))

  const query = useSuspenseQuery({
    queryKey: ['line-routes', lineCode],
    queryFn: () => getAllRoutes(lineCode),
    staleTime: 60_000 * 30,
  })

  const getRouteFromCode = useCallback(() => {
    return query.data?.find(item => item.route_code === routeCode)
  }, [query.data, routeCode])

  return {
    query,
    routeCode,
    getRouteFromCode,
  }
}
