import { immer } from 'zustand/middleware/immer'

import type { City } from '@/types/city'
import type { RouteCode, RouteDirection } from '@/types/line'

import { useFilterStore } from './filter'

export interface RoutesSlice {
  routes: Record<City, Record<string, RouteCode>>
  setRoute: (code: string, routeCode: RouteCode) => void
  changeRouteDirection: (code: string) => void
}

export const createRoutesSlice = immer<RoutesSlice>((set) => ({
  changeRouteDirection: (code) =>
    set((state) => {
      const { city } = useFilterStore.getState()
      const routeCode = state.routes[city][code] || `${code}_G_D0`

      const direction = routeCode.split('_')[1] as RouteDirection
      const otherDirectionCode = routeCode.replace(
        /G|D/,
        direction === 'G' ? 'D' : 'G',
      ) as RouteCode

      state.routes[city][code] = otherDirectionCode
    }),
  routes: {
    istanbul: {},
    izmir: {},
  },
  setRoute: (code, routeCode) =>
    set((state) => {
      const { city } = useFilterStore.getState()
      state.routes[city][code] = routeCode
    }),
}))
