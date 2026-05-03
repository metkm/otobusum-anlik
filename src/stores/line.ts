import AsyncStorage from '@react-native-async-storage/async-storage'
import { randomUUID } from 'expo-crypto'
import { Alert, ToastAndroid } from 'react-native'
import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { useFilterStore } from './filter'
import { useThemeStore } from './theme'

import { i18n } from '@/translations/i18n'
import { City } from '@/types/city'
import { LineGroup, RouteCode, RouteDirection } from '@/types/line'

export interface LineStoreV3 {
  lines: Record<City, string[]>
  lineGroups: Record<City, Record<string, { id: string, lineCodes: string[], title: string }>>
}

interface LineCodeSlice {
  lines: Record<City, LineGroup[]>
  groupId: Record<City, string>
  setGroupId: (id: string) => void
  createGroup: () => void
  deleteGroup: (id: string) => void
  updateGroupName: (id: string, name: string) => void
  addLine: (code: string) => void
  addLineToGroup: (code: string, groupId: string) => void
  deleteLine: (code: string, groupId?: string) => void
  getLineGroup: () => LineGroup | undefined
  getLines: () => string[]
  getGroupId: () => string
}

interface LineRouteSlice {
  routes: Record<City, Record<string, RouteCode>>
  setRoute: (code: string, routeCode: RouteCode) => void
  changeRouteDirection: (code: string) => void
  getRoutes: () => Record<string, RouteCode>
}

type LineStore = (LineCodeSlice & LineRouteSlice)

const createLineCodeSlice = immer<LineCodeSlice>((set, get) => ({
  lines: {
    istanbul: [{ id: 'default', name: 'default', codes: [] }],
    izmir: [{ id: 'default', name: 'default', codes: [] }],
  },
  groupId: {
    istanbul: 'default',
    izmir: 'default',
  },
  setGroupId: id => set((state) => {
    const city = useFilterStore.getState().city
    state.groupId[city] = id
  }),
  createGroup: () => set((state) => {
    const city = useFilterStore.getState().city
    const uuid = randomUUID()

    state.lines[city].push({
      id: uuid,
      codes: [],
      name: uuid,
    })
  }),
  deleteGroup: async (id) => {
    await new Promise<void>((resolve) => {
      Alert.alert(i18n.t('deleteGroup'), i18n.t('areYouSure'), [
        {
          text: i18n.t('cancel'),
        },
        {
          text: i18n.t('delete'),
          onPress: () => resolve(),
        },
      ])
    })

    return set((state) => {
      const city = useFilterStore.getState().city
      const groups = state.lines[city]

      if (groups.length < 2)
        return

      const i = groups.findIndex(gr => gr.id === id)
      if (i === -1 || i === undefined)
        return

      state.lines[city]?.splice(i, 1)

      if (state.getGroupId() === id) {
        state.groupId[city] = groups.at(0)!.id
      }

      useThemeStore
        .getState()
        .deleteUnusedThemes(state.lines[city].flatMap(gr => gr.codes))
    })
  },
  updateGroupName: (id, name) => set((state) => {
    const city = useFilterStore.getState().city

    const group = state.lines[city].find(gr => gr.id === id)
    if (!group)
      return

    group.name = name
  }),
  addLine: code => set((state) => {
    const city = useFilterStore.getState().city
    const codes = state.lines[city].find(c => c.id === state.getGroupId())?.codes

    if (!codes)
      return

    if (codes.length > 3) {
      ToastAndroid.show(i18n.t('lineLimitExceeded'), ToastAndroid.SHORT)
      return
    }

    if (codes.includes(code)) {
      ToastAndroid.show(i18n.t('lineAlreadyInGroup'), ToastAndroid.SHORT)
      return
    }

    codes?.push(code)
    useThemeStore.getState().createTheme(code)

    ToastAndroid.show(i18n.t('added', { code }), ToastAndroid.SHORT)
  }),
  addLineToGroup: (code, groupId) => set((state) => {
    const city = useFilterStore.getState().city
    state.lines[city].find(c => c.id === groupId)?.codes.push(code)
  }),
  deleteLine: (code, groupId) => set((state) => {
    const city = useFilterStore.getState().city
    const codes = state.lines[city]?.find(c => c.id === (groupId || state.getGroupId()))?.codes

    const i = codes?.findIndex(c => c === code)
    if (i === -1 || i === undefined)
      return

    codes?.splice(i, 1)

    const groups = state.lines[city]
    for (let index = 0; index < groups.length; index++) {
      const group = groups[index]

      if (!group || group.id === groupId)
        continue

      if (group.codes.includes(code))
        return
    }

    useThemeStore.getState().deleteTheme(code)
  }),
  getGroupId: () => get().groupId[useFilterStore.getState().city],
  getLineGroup: () => {
    const city = useFilterStore.getState().city
    return get().lines[city].find(gr => gr.id === get().getGroupId())
  },
  getLines: () => get().getLineGroup()?.codes || [],
}))

const createLineRouteSlice = immer<LineRouteSlice>((set, get) => ({
  routes: {
    istanbul: {},
    izmir: {},
  },
  setRoute: (code, routeCode) => set((state) => {
    const city = useFilterStore.getState().city
    state.routes[city][code] = routeCode
  }),
  changeRouteDirection: code => set((state) => {
    const city = useFilterStore.getState().city
    const routeCode = state.routes[city]?.[code] || `${code}_G_D0`

    const direction = routeCode.split('_')[1] as RouteDirection
    const otherDirectionCode = routeCode.replace(/G|D/, direction === 'G' ? 'D' : 'G') as RouteCode

    state.routes[city][code] = otherDirectionCode
  }),
  getRoutes: () => {
    const city = useFilterStore.getState().city
    return get().routes[city]
  },
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

    // migrate lines
    for (const [city, value] of Object.entries(oldStore.lines)) {
      if (!newStore.lines)
        continue

      newStore.lines[city as City] = [{ id: 'default', name: 'default', codes: value }]
      value.forEach(c => allCodes.add(c))
    }

    // migrate groups
    for (const [city, groups] of Object.entries(oldStore.lineGroups)) {
      for (const [id, value] of Object.entries(groups)) {
        if (!newStore.lines)
          continue

        newStore.lines[city as City].push({ id, name: value.title, codes: value.lineCodes })
        value.lineCodes.forEach(c => allCodes.add(c))
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
    subscribeWithSelector<LineStore>((...a) => (
      {
        ...createLineCodeSlice(...a),
        ...createLineRouteSlice(...a),
      }),
    ),
    {
      name: 'line-storage',
      storage: createJSONStorage(() => AsyncStorage),
      migrate,
      version: 4,
    },
  ),
)
