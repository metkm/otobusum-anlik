import '@/global.css'
import { Sheet } from '@lodev09/react-native-true-sheet/navigation/expo-router'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router'
import { type Theme } from 'expo-router/react-navigation'
import { StatusBar } from 'expo-status-bar'
import { I18nextProvider } from 'react-i18next'
import { useColorScheme } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaListener } from 'react-native-safe-area-context'
import { Uniwind, useCSSVariable } from 'uniwind'

import { persister, queryClient } from '@/api/client'
import { MapProvider } from '@/components/MapProvider'
import { useSettingsStore } from '@/stores'
import i18n from '@/translations/i18n'

export const unstable_settings = {
  anchor: '(home)',
}

const RootContent = () => {
  const backgroundColor = useCSSVariable('--ui-bg')?.toString()

  const storeColor = useSettingsStore.getState().colorScheme
  if (storeColor) {
    Uniwind.setTheme(storeColor)
  }

  return (
    <MapProvider>
      <Sheet screenOptions={{ backgroundColor, style: { flex: 1 } }}>
        <Sheet.Screen name="(home)" />

        <Sheet.Screen
          name="(sheet)/groups/index"
          options={{ detents: ['auto'] }}
        />
        <Sheet.Screen
          name="(sheet)/groups/[groupId]"
          options={{ detents: ['auto'] }}
        />

        <Sheet.Screen name="(sheet)/bus-info/[doorNo]" />
        <Sheet.Screen name="(sheet)/stop/[stopCode]" />
        <Sheet.Screen
          name="(sheet)/markers/nearby"
          options={{ detents: ['auto'], dimmed: false }}
        />
      </Sheet>
    </MapProvider>
  )
}

export const RootLayout = () => {
  const background = useCSSVariable('--background-color-default')?.toString()
  const colorScheme = useColorScheme()

  const baseTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme

  const theme: Theme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      background: background ?? baseTheme.colors.background,
      card: background ?? baseTheme.colors.background,
    },
  }

  return (
    <I18nextProvider
      i18n={i18n}
      defaultNS="translation"
    >
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          dehydrateOptions: {
            shouldDehydrateQuery: (query) => Boolean(query.meta?.persist),
          },
          persister,
        }}
      >
        <StatusBar style="auto" />

        <GestureHandlerRootView style={{ backgroundColor: background as string, flexGrow: 1 }}>
          <SafeAreaListener
            onChange={({ insets }) => {
              Uniwind.updateInsets(insets)
            }}
          >
            <ThemeProvider value={theme}>
              <RootContent />
            </ThemeProvider>
          </SafeAreaListener>
        </GestureHandlerRootView>
      </PersistQueryClientProvider>
    </I18nextProvider>
  )
}

export default RootLayout
