import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export interface FiltersStore {
  selectedRoutes: Record<string, string>
  invisibleLines: Record<string, boolean>
  selectedGroup: string | undefined
}

export const useFilters = create(
  subscribeWithSelector(
    persist<FiltersStore>(
      () => ({
        selectedRoutes: {},
        invisibleLines: {},
        selectedGroup: undefined,
      }),
      {
        name: 'filter-storage',
        storage: createJSONStorage(() => AsyncStorage),
      },
    ),
  ),
)

export const toggleLineVisibility = (lineCode: string) => useFilters.setState((state) => {
  if (state.invisibleLines[lineCode]) {
    delete state.invisibleLines[lineCode]
    return {
      invisibleLines: {
        ...state.invisibleLines,
      },
    }
  }

  return {
    invisibleLines: {
      ...state.invisibleLines,
      [lineCode]: true,
    },
  }
})

export const selectRoute = (lineCode: string, routeCode: string) => useFilters.setState((state) => {
  return {
    selectedRoutes: {
      ...state.selectedRoutes,
      [lineCode]: routeCode,
    },
  }
})

export const selectGroup = (groupId: string) => useFilters.setState(() => {
  return {
    selectedGroup: groupId,
  }
})

export const unSelectGroup = () => useFilters.setState(() => {
  return {
    selectedGroup: undefined,
  }
})
