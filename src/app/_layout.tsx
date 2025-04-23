import '@/assets/styles.css'

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native'
import { DehydrateOptions } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { setBackgroundColorAsync } from 'expo-system-ui'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { enableFreeze, enableScreens } from 'react-native-screens'

import { TheStatusBar } from '@/components/TheStatusBar'

import { useTheme } from '@/hooks/useTheme'

import { persister, queryClient } from '@/api/client'
import { i18n } from '@/translations/i18n'

SplashScreen.preventAutoHideAsync()

SplashScreen.setOptions({
  duration: 150,
  fade: true,
})

enableFreeze(true)
enableScreens(true)

export const RootLayout = () => {
  const { colorsTheme, mode } = useTheme()

  const targetTheme = mode === 'dark' ? DarkTheme : DefaultTheme

  const modifiedTheme: Theme = {
    ...targetTheme,
    colors: {
      ...targetTheme.colors,
      background: colorsTheme.surfaceContainerLow,
      card: colorsTheme.surfaceContainerLow,
    },
  }

  setBackgroundColorAsync(modifiedTheme.colors.background)

  const dehydrateOptions: DehydrateOptions = {
    shouldDehydrateQuery: (query) => {
      return !!query.meta?.persist
    },
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        dehydrateOptions,
      }}
    >
      <TheStatusBar />

      <GestureHandlerRootView>
        <ThemeProvider value={modifiedTheme}>
          <BottomSheetModalProvider>
            <Stack
              screenOptions={{
                title: 'Otobüsüm Anlık',
                navigationBarColor: colorsTheme.surfaceContainerLow,
                animation: 'fade',
              }}
            >
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="modal"
                options={{
                  presentation: 'modal',
                  headerShown: false
                }}
              />
              <Stack.Screen
                name="group/[groupId]/edit"
                options={{ headerTitle: i18n.t('editGroupTitle') }}
              />
            </Stack>
          </BottomSheetModalProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </PersistQueryClientProvider>
  )
}

export default RootLayout
