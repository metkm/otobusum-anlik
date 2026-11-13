import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'

import type { City } from '@/types/city'
import type { GroupsSliceV4 } from '@/types/storeMigration'

import { createGroupsSlice, type GroupsSlice } from './groups'
import { createRoutesSlice, type RoutesSlice } from './routes'

type TransitStorage = GroupsSlice & RoutesSlice

export const useTransitStore = create(
  persist(
    subscribeWithSelector<TransitStorage>((...a) => ({
      ...createGroupsSlice(...a),
      ...createRoutesSlice(...a),
    })),
    {
      migrate: (persistedState: unknown, version) => {
        const store = persistedState as TransitStorage

        if (version === 4) {
          const version4 = persistedState as GroupsSliceV4

          store.selectedGroup = version4.groupId
          store.groups = Object.fromEntries(
            Object.entries(version4.lines).map(([city, lines]) => [
              city as City,
              lines.map((line) => ({
                id: line.id,
                items: line.codes.map((code) => ({ code, type: 'line' })),
                name: line.name,
              })),
            ]),
          ) as TransitStorage['groups']

          delete (version4 as Partial<GroupsSliceV4>).groupId
          delete (version4 as Partial<GroupsSliceV4>).lines
        }

        return store
      },
      name: 'line-storage',
      storage: createJSONStorage(() => AsyncStorage),
      version: 5,
    },
  ),
)
