import AsyncStorage from '@react-native-async-storage/async-storage'
import { randomUUID } from 'expo-crypto'
import { t } from 'i18next'
import { Alert, ToastAndroid } from 'react-native'
import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { GROUP_LINE_LIMIT } from '@/constants/app'
import type { City } from '@/types/city'
import type { LineGroup, RouteCode, RouteDirection } from '@/types/line'

import { useFilterStore } from './filter'
import { useThemeStore } from './theme'

interface LineStoreV3 {
  lines: Record<City, string[]>
  lineGroups: Record<City, Record<string, { id: string; lineCodes: string[]; title: string }>>
}

export interface LineCodeSlice {
  lines: Record<City, LineGroup[]>
  groupId: Record<City, string>
  setGroupId: (id: string) => void
  createGroup: () => void
  deleteGroup: (id: string) => void
  updateGroupName: (id: string, name: string) => void
  addLine: (code: string, groupId?: string) => void
  deleteLine: (code: string, groupId?: string) => void
}

export interface LineRouteSlice {
  routes: Record<City, Record<string, RouteCode>>
  setRoute: (code: string, routeCode: RouteCode) => void
  changeRouteDirection: (code: string) => void
}

interface LineStore extends LineCodeSlice, LineRouteSlice { }

const createLineCodeSlice = immer<LineCodeSlice>((set) => ({
  addLine: (code, groupId) =>
    set((state) => {
      const { city } = useFilterStore.getState()
      const grId = groupId ?? state.groupId[city]

      const codes = state.lines[city].find((c) => c.id === grId)?.codes

      if (!codes) {
        return
      }

      if (codes.length >= GROUP_LINE_LIMIT) {
        ToastAndroid.show(t('lineLimitExceeded'), ToastAndroid.SHORT)
        return
      }

      if (codes.includes(code)) {
        ToastAndroid.show(t('lineAlreadyInGroup'), ToastAndroid.SHORT)
        return
      }

      codes.push(code)
      useThemeStore.getState().createTheme(code)

      ToastAndroid.show(t('added', { code }), ToastAndroid.SHORT)
    }),
  createGroup: () =>
    set((state) => {
      const { city } = useFilterStore.getState()
      const uuid = randomUUID()

      state.lines[city].push({
        codes: [],
        id: uuid,
        name: uuid,
      })
    }),
  deleteGroup: async (id) => {
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
      const groups = state.lines[city]

      if (groups.length < 2) {
        return
      }

      const i = groups.findIndex((gr) => gr.id === id)
      if (i === -1) {
        return
      }

      state.lines[city].splice(i, 1)

      if (state.groupId[city] === id) {
        state.groupId[city] = groups.at(0)!.id
      }

      useThemeStore.getState().deleteUnusedThemes(state.lines[city].flatMap((gr) => gr.codes))
    })
  },
  deleteLine: (code, groupId) =>
    set((state) => {
      const { city } = useFilterStore.getState()
      const targetGroupId = groupId ?? state.groupId[city]

      const codes = state.lines[city].find((c) => c.id === targetGroupId)?.codes

      const i = codes?.indexOf(code)
      if (i === -1 || i === undefined) {
        return
      }

      codes?.splice(i, 1)

      const groups = state.lines[city]

      for (const group of groups) {
        if (group.codes.includes(code) && group.id !== targetGroupId) {
          return
        }
      }

      useThemeStore.getState().deleteTheme(code)
    }),
  groupId: {
    istanbul: 'default',
    izmir: 'default',
  },
  lines: {
    istanbul: [{ codes: [], id: 'default', name: 'default' }],
    izmir: [{ codes: [], id: 'default', name: 'default' }],
  },
  setGroupId: (id) =>
    set((state) => {
      const { city } = useFilterStore.getState()
      state.groupId[city] = id
    }),
  updateGroupName: (id, name) =>
    set((state) => {
      const { city } = useFilterStore.getState()

      const group = state.lines[city].find((gr) => gr.id === id)
      if (!group) {
        return
      }

      group.name = name
    }),
}))

const createLineRouteSlice = immer<LineRouteSlice>((set) => ({
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

const migrate = (persistedStore: unknown, version: number) => {
  const oldStore = persistedStore as LineStoreV3
  const newStore = {
    lines: {
      istanbul: [],
      izmir: [],
    },
  } as Partial<LineStore>

  if (version === 3) {
    const allCodes = new Set<string>()

    // Migrate lines
    for (const [city, value] of Object.entries(oldStore.lines)) {
      if (newStore.lines) {
        newStore.lines[city as City] = [{ codes: value, id: 'default', name: 'default' }]
        value.forEach((c) => allCodes.add(c))
      }
    }

    // Migrate groups
    for (const [city, groups] of Object.entries(oldStore.lineGroups)) {
      for (const [id, value] of Object.entries(groups)) {
        if (newStore.lines) {
          newStore.lines[city as City].push({ codes: value.lineCodes, id, name: value.title })
          value.lineCodes.forEach((c) => allCodes.add(c))
        }
      }
    }

    for (const code of allCodes) {
      useThemeStore.getState().createTheme(code)
    }
  }

  return newStore
}

export const useLineStore = create(
  persist(
    subscribeWithSelector<LineStore>((...a) => ({
      ...createLineCodeSlice(...a),
      ...createLineRouteSlice(...a),
    })),
    {
      migrate,
      name: 'line-storage',
      storage: createJSONStorage(() => AsyncStorage),
      version: 4,
    },
  ),
)
