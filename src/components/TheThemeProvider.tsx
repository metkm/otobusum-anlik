import { VariableContextProvider } from 'nativewind'
import { ColorSchemeName, useColorScheme } from 'react-native'

const themes: Record<string, Record<ColorSchemeName, Record<string, string>>> = {
  brand: {
    light: {
      '--color-foreground': '#000000',
      '--color-muted-foreground': '#64748b',
      '--color-primary': '#3b82f6',
      '--color-secondary': '#8b5cf6',
    },
    dark: {
      '--color-foreground': '#ffffff',
      '--color-muted-foreground': '#a1a1a1',
      '--color-primary': '#60a5fa',
      '--color-secondary': '#a78bfa',
    },
    unspecified: {
      '--color-foreground': '#ffffff',
      '--color-muted-foreground': '#a1a1a1',
      '--color-primary': '#60a5fa',
      '--color-secondary': '#a78bfa',
    },
  },
  christmas: {
    light: {
      '--color-foreground': '#000000',
      '--color-muted-foreground': '#64748b',
      '--color-primary': '#dc2626',
      '--color-secondary': '#16a34a',
    },
    dark: {
      '--color-foreground': '#ffffff',
      '--color-muted-foreground': '#a1a1a1',
      '--color-primary': '#f87171',
      '--color-secondary': '#4ade80',
    },
    unspecified: {
      '--color-foreground': '#ffffff',
      '--color-muted-foreground': '#a1a1a1',
      '--color-primary': '#f87171',
      '--color-secondary': '#4ade80',
    },
  },
}

export const TheThemeProvider = ({
  name,
  children,
}: {
  name: keyof typeof themes
  children: React.ReactNode
}) => {
  const colorScheme = useColorScheme() ?? 'light'

  return (
    <VariableContextProvider value={themes[name][colorScheme]}>
      {children}
    </VariableContextProvider>
  )
}
