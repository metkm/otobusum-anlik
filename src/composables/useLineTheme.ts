import { useColorScheme } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { useLine } from './useLine'

import { useThemeStore } from '@/stores/theme'

export const useLineTheme = () => {
  const { code } = useLine()
  const colorScheme = useColorScheme()

  const themes = useThemeStore(useShallow(state => state.themes()))
  const theme = themes[code]?.[colorScheme === 'unspecified' ? 'dark' : colorScheme]

  return theme
}
