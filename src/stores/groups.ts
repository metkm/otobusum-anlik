import { randomUUID } from 'expo-crypto'
import { t } from 'i18next'
import { Alert, ToastAndroid } from 'react-native'
import { immer } from 'zustand/middleware/immer'

import { GROUP_ITEM_TYPE_LIMIT } from '@/constants/app'
import type { City } from '@/types/city'

import { useFilterStore } from './filter'
import { useThemeStore } from './theme'

export type GroupItemType = 'line' | 'stop'

export interface GroupItem {
  type: GroupItemType
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
  createGroup: () => void
}

export const createGroupsSlice = immer<GroupsSlice>((set, get) => ({
  addItemToGroup: (item, groupId) => {
    set((state) => {
      const { city } = useFilterStore.getState()
      const grId = groupId ?? get().selectedGroup[city]
      const group = state.groups[city].find((x) => x.id === grId)

      if (!group) {
        return
      }

      const itemTypeCountInGroup = group.items.reduce(
        (acc, curr) => (curr.type === item.type ? acc + 1 : acc),
        0,
      )

      if (itemTypeCountInGroup >= GROUP_ITEM_TYPE_LIMIT) {
        ToastAndroid.show(t('itemTypeLimitExceeded'), ToastAndroid.SHORT)
        return
      }

      if (group.items.find((x) => x.code === item.code)) {
        ToastAndroid.show(t('itemAlreadyInGroup'), ToastAndroid.SHORT)
        return
      }

      group?.items.push(item)
      if (item.type === 'line') {
        useThemeStore.getState().createTheme(item.code)
      }
      ToastAndroid.show(t('added', { code: item.code }), ToastAndroid.SHORT)
    })
  },
  createGroup: () =>
    set((state) => {
      const { city } = useFilterStore.getState()
      const uuid = randomUUID()
      state.groups[city].push({
        id: uuid,
        items: [],
        name: uuid,
      })
    }),
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
      if (i === undefined || i === -1 || !group) {
        return
      }

      group.items.splice(i, 1)
      const groups = state.groups[city]

      for (const group of groups) {
        const found = group.items.find((x) => x.code === code)
        if (found && group.id !== grId) {
          return
        }
      }

      useThemeStore.getState().deleteTheme(code)
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
