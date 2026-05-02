import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { City } from '@/types/city'

export interface FiltersStore {
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
      migrate: () => {},
      version: 4,
    },
  ),
)
