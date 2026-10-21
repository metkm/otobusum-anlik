import { ReactNode, use } from 'react'
import { ScopedVariables } from 'uniwind'
import { useShallow } from 'zustand/react/shallow'

import { useColorScheme } from '@/composables'
import { LineContext } from '@/composables/useLine'
import { useFilterStore, useThemeStore } from '@/stores'

export const ThemeProvider = ({ code, children }: { code?: string; children?: ReactNode }) => {
  const city = useFilterStore(useShallow((state) => state.city))
  const themeStore = useThemeStore(useShallow((state) => state.themesByCity[city]))

  const lineCode = code ?? use(LineContext)
  const colorScheme = useColorScheme()

  if (!lineCode) {
    return children
  }

  const theme = themeStore[lineCode]?.[colorScheme]

  if (!theme) {
    return children
  }

  return (
    <ScopedVariables
      variables={{
        '--ui-bg': theme['ui-bg'],
        '--ui-bg-muted': theme['ui-bg-muted'],
        '--ui-border': theme['ui-border'],
        '--ui-border-muted': theme['ui-border-muted'],
        '--ui-text': theme['ui-text'],
        '--ui-text-inverted': theme['ui-text-inverted'],
        '--color-primary': theme['ui-primary'],
      }}
    >
      {children}
    </ScopedVariables>
  )
}
