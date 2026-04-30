import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { City } from '@/types/city'

export interface FiltersStore {
  // selectedRoutes: Record<string, RouteCode>
  // selectedGroup?: string
  city: City
  hiddenLines: string[]
  toggleLineHidden: (code: string) => void
}

export const useFilterStore = create(
  persist(
    subscribeWithSelector(
      immer<FiltersStore>((set, _get) => ({
        city: 'istanbul',
        hiddenLines: [],
        toggleLineHidden: (code: string) => set((state) => {
          const i = state.hiddenLines.indexOf(code)
          if (i === -1) {
            state.hiddenLines.push(code)
          } else {
            state.hiddenLines.splice(i, 1)
          }
        }),
      }),
      ),

    ),
    {
      name: 'filter-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)

// export const selectRoute = (lineCode: string, routeCode: RouteCode) => useFiltersStore.setState((state) => {
//   return {
//     selectedRoutes: {
//       ...state.selectedRoutes,
//       [lineCode]: routeCode,
//     },
//   }
// })

// export const getSelectedRouteCode = (lineCode: string): RouteCode => {
//   const filtersStore = useFiltersStore.getState()
//   const selectedRouteCode = filtersStore.selectedRoutes[lineCode] as RouteCode | undefined

//   if (!selectedRouteCode) {
//     const busLocations = queryClient
//       .getQueryData<Awaited<ReturnType<typeof getLineBusLocations>>>(['line', lineCode])

//     const def = `${lineCode}_G_D0` as RouteCode
//     if (!busLocations || busLocations.length < 1) {
//       return def
//     }

//     const found = busLocations.find(loc => loc.route_code === def)
//     if (found) return def

//     const anotherRouteCodeWithLocation = busLocations.find(loc => loc.route_code.includes('_G_'))?.route_code as RouteCode | undefined
//     return anotherRouteCodeWithLocation || def
//   }

//   return selectedRouteCode
// }

// export const changeRouteDirection = (lineCode: string) => useFiltersStore.setState((state) => {
//   const routeCode = getSelectedRouteCode(lineCode)

//   const [left, dir, right] = routeCode.split('_')
//   if (!right || !dir)
//     return state

//   const allRoutes = queryClient.getQueryData<LineRoute[]>(['line-routes', lineCode])
//   if (!allRoutes)
//     return state

//   const dCode = parseInt(right.substring(1))

//   const direction = dir as Direction
//   const otherDirection = direction === 'D' ? 'G' : 'D'

//   const oneLess = `${left}_${otherDirection}_D${dCode - 1}`
//   const equal = `${left}_${otherDirection}_D${dCode}`
//   const oneMore = `${left}_${otherDirection}_D${dCode + 1}`

//   const otherRoute = allRoutes.find(
//     route => route.route_code === oneLess || route.route_code === oneMore || route.route_code === equal,
//   )

//   if (!otherRoute)
//     return state

//   return {
//     selectedRoutes: {
//       ...state.selectedRoutes,
//       [lineCode]: otherRoute.route_code || `${lineCode}_G_D0`,
//     },
//   }
// })

// export const selectGroup = (newGroupId?: string) => useFiltersStore.setState(() => {
//   return {
//     selectedGroup: newGroupId,
//   }
// })

// export const unSelectGroup = () => useFiltersStore.setState(() => {
//   return {
//     selectedGroup: undefined,
//   }
// })
