import { t } from 'i18next'
import { Alert } from 'react-native'
import { immer } from 'zustand/middleware/immer'

import type { City } from '@/types/city'

import { useFilterStore } from './filter'
import { useThemeStore } from './theme'

export interface GroupItem {
  type: 'line' | 'stop'
  code: string
}

export interface Group {
  id: string
  name: string
  items: GroupItem[]
}

export interface GroupsSlice {
  groups: Record<City, Group[]>
  selectedGroup: Record<City, string>
  addItemToGroup: (item: GroupItem, groupId?: string) => void
  removeItemFromGroup: (code: string, groupId?: string) => void
  selectGroup: (groupId: string) => void
  updateGroupName: (id: string, name: string) => void
  deleteGroup: (id: string) => void
}

export const createGroupsSlice = immer<GroupsSlice>((set, get) => ({
  addItemToGroup: (item, groupId) => {
    set((state) => {
      const { city } = useFilterStore.getState()
      const grId = groupId ?? get().selectedGroup[city]
      const group = state.groups[city].find((x) => x.id === grId)

      group?.items.push(item)
    })
  },
  deleteGroup: async (id) => {
    // oxlint-disable-next-line promise/avoid-new
    await new Promise<void>((resolve) => {
      Alert.alert(t('deleteGroup'), t('areYouSure'), [
        {
          text: t('cancel'),
        },
        {
          onPress: () => resolve(),
          text: t('delete'),
        },
      ])
    })

    return set((state) => {
      const { city } = useFilterStore.getState()
      const groups = state.groups[city]

      if (groups.length < 2) {
        return
      }

      const i = groups.findIndex((gr) => gr.id === id)
      if (i === -1) {
        return
      }

      state.groups[city].splice(i, 1)
      if (state.selectedGroup[city] === id) {
        state.selectedGroup[city] = groups.at(0)!.id
      }

      const codes = state.groups[city]
        .flatMap((group) => group.items.filter((item) => item.type === 'line'))
        .map((items) => items.code)

      useThemeStore.getState().deleteUnusedThemes(codes)
    })
  },
  getGroup: (groupId?: string) => {
    const { city } = useFilterStore.getState()
    const grId = groupId ?? get().selectedGroup[city]

    return get().groups[city].find((x) => x.id === grId)
  },
  groups: {
    istanbul: [{ id: 'a', items: [], name: 'default' }],
    izmir: [{ id: 'a', items: [], name: 'default' }],
  },
  removeItemFromGroup: (code, groupId) => {
    set((state) => {
      const { city } = useFilterStore.getState()
      const grId = groupId ?? get().selectedGroup[city]
      const group = state.groups[city].find((x) => x.id === grId)

      const i = group?.items.findIndex((x) => x.code === code)
      if (i !== undefined && i !== -1 && group) {
        group.items.splice(i, 1)
      }
    })
  },
  selectGroup: (groupId) =>
    set((state) => {
      const { city } = useFilterStore.getState()
      state.selectedGroup[city] = groupId
    }),
  selectedGroup: {
    istanbul: 'a',
    izmir: 'a',
  },
  updateGroupName: (id, name) =>
    set((state) => {
      const { city } = useFilterStore.getState()
      const group = state.groups[city].find((gr) => gr.id === id)
      if (group) {
        group.name = name
      }
    }),
}))
