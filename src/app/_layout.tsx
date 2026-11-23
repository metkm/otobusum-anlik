import '../global.css'
import { Sheet } from '@lodev09/react-native-true-sheet/navigation/expo-router'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { NavigationBar } from 'expo-navigation-bar'
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router'
import { type Theme } from 'expo-router/react-navigation'
import { StatusBar } from 'expo-status-bar'
import { I18nextProvider } from 'react-i18next'
import { SafeAreaListener } from 'react-native-safe-area-context'
import { Uniwind, useCSSVariable } from 'uniwind'

import { persister, queryClient } from '@/api/client'
import { CarouselProvider } from '@/components/provider/CarouselProvider'
import { MapProvider } from '@/components/provider/MapProvider'
import { UNativeGestureHandlerRootView } from '@/components/u/native/UNativeGestureHandlerRootView'
import { useColorScheme } from '@/composables'
import { useSettingsStore } from '@/stores'
import i18n from '@/translations/i18n'

export const unstable_settings = {
  anchor: '(home)/(tabs)',
}

// to make react compiler happy
const setUniwindTheme = () => {
  const storeColor = useSettingsStore.getState().colorScheme
  if (storeColor) {
    Uniwind.setTheme(storeColor)
  }
}

const RootContent = () => {
  const backgroundColor = useCSSVariable('--background-color-default')?.toString()
  const colorScheme = useColorScheme()

  const baseTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme

  const theme: Theme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      background: backgroundColor ?? baseTheme.colors.background,
      card: backgroundColor ?? baseTheme.colors.background,
    },
  }

  setUniwindTheme()

  return (
    <SafeAreaListener
      onChange={({ insets }) => {
        Uniwind.updateInsets(insets)
      }}
    >
      <ThemeProvider value={theme}>
        <CarouselProvider>
          <MapProvider>
            <NavigationBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

            <Sheet
              screenOptions={{
                backgroundColor,
                style: { flex: 1 },
              }}
            >
              <Sheet.Screen name="(home)/(tabs)" />

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
                options={{ detents: [0.5, 0.8], dimmed: false }}
              />
            </Sheet>
          </MapProvider>
        </CarouselProvider>
      </ThemeProvider>
    </SafeAreaListener>
  )
}

export const RootLayout = () => (
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

      <UNativeGestureHandlerRootView>
        <RootContent />
      </UNativeGestureHandlerRootView>
    </PersistQueryClientProvider>
  </I18nextProvider>
)

export default RootLayout
