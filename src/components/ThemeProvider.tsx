import { ReactNode, use } from 'react'
import { ScopedVariables } from 'uniwind'
import { useShallow } from 'zustand/react/shallow'

import { LineContext } from '@/composables/useLine'
import { useColorScheme } from '@/composables/useLineTheme'
import { useFilterStore, useThemeStore } from '@/stores'

export const ThemeProvider = ({
  code,
  children,
}: {
  code?: string
  children?: ReactNode
}) => {
  const city = useFilterStore(useShallow(state => state.city))
  const themeStore = useThemeStore(useShallow(state => state.themesByCity[city]))

  const lineCode = code ?? use(LineContext)
  const colorScheme = useColorScheme()

  if (!lineCode) {
    return children
  }

  const theme = themeStore[lineCode]?.[colorScheme]

  if (!theme) {
    return children
  }

  console.log(theme['ui-bg'])
  return (
    <ScopedVariables
      variables={{
        '--ui-bg': theme['ui-bg'],
        // '--color-bg-muted': theme['ui-bg-muted'],
        // '--color-primary': theme['ui-primary'],
      }}
    >
      {children}
    </ScopedVariables>
  )
}
