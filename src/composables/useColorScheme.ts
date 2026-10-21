import { useColorScheme as _useColorScheme } from 'react-native'
import type { ColorScheme } from 'react-native-screens'
import { useShallow } from 'zustand/react/shallow'

import { useSettingsStore } from '@/stores'

export const useColorScheme = (): ColorScheme => {
  const colorSchemeStore = useSettingsStore(useShallow((state) => state.colorScheme))
  const colorScheme = _useColorScheme()

  if (colorSchemeStore) return colorSchemeStore

  return colorScheme ?? 'dark'
}
