import { useColorScheme } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { Schemes, useThemeStore } from '@/stores'

export const defaultTheme: Schemes = {
  dark: {
    'ui-bg': '1d161e', // mauve-900
    'ui-bg-muted': '#2a212c', // mauve-800
    'ui-text-muted': '#a89ea9', // mauve-400
    'ui-text': '#e7e4e7', // mauve-200
    'ui-text-inverted': '#1d161e', // mauve-900
    'ui-primary': '#fdbe12', // bright-sun-400
    'ui-error': '#f87171', // red-400 (tailwind default)
    'ui-border': '#463947', // mauve-700 (visible on dark bg)
    'ui-border-muted': '#594c5b', // mauve-600
  },

  light: {
    'ui-bg': '#ffffff',
    'ui-bg-muted': '#fafafa', // mauve-50
    'ui-text-muted': '#79697b', // mauve-500
    'ui-text': '#463947', // mauve-700
    'ui-text-inverted': '#ffffff',
    'ui-primary': '#eca506', // bright-sun-500
    'ui-error': '#ef4444', // red-500
    'ui-border': '#d7d0d7', // mauve-300
    'ui-border-muted': '#e7e4e7', // mauve-200
  },
}

export const useLineTheme = (code?: string) => {
  const colorScheme = useColorScheme()
  const themes = useThemeStore(useShallow(state => state.themes()))
  const prefer = colorScheme === 'unspecified' ? 'dark' : colorScheme

  if (!code)
    return

  return themes[code]?.[prefer]
}
