import { use, type ReactNode } from 'react'
import { ScopedVariables } from 'uniwind'
import { useShallow } from 'zustand/react/shallow'

import { useColorScheme } from '@/composables'
import { GroupItemContext } from '@/composables/useGroupItem'
import { useFilterStore, useThemeStore } from '@/stores'

export const ThemeProvider = ({
  value: _code,
  children,
}: {
  value?: string
  children?: ReactNode
}) => {
  const city = useFilterStore(useShallow((state) => state.city))
  const themeStore = useThemeStore(useShallow((state) => state.themesByCity[city]))

  const code = _code ?? use(GroupItemContext)
  const colorScheme = useColorScheme()

  if (!code) {
    return children
  }

  const theme = themeStore[code]?.[colorScheme]

  if (!theme) {
    return children
  }

  return (
    <ScopedVariables
      variables={{
        '--color-primary': theme['ui-primary'],
        '--ui-bg': theme['ui-bg'],
        '--ui-bg-muted': theme['ui-bg-muted'],
        '--ui-border': theme['ui-border'],
        '--ui-border-muted': theme['ui-border-muted'],
        '--ui-text': theme['ui-text'],
        '--ui-text-inverted': theme['ui-text-inverted'],
      }}
    >
      {children}
    </ScopedVariables>
  )
}
