import { useColorScheme } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { useThemeStore } from '@/stores/theme'

export const useLineTheme = (code: string) => {
  const colorScheme = useColorScheme()

  const themes = useThemeStore(useShallow(state => state.themes()))
  const theme = themes[code]?.[colorScheme === 'unspecified' ? 'dark' : colorScheme]

  return theme
}
