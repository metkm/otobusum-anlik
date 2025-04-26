import '@/assets/styles.css'

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { DarkTheme, DefaultTheme, ThemeProvider, type Theme } from '@react-navigation/native'
import { DehydrateOptions } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { setBackgroundColorAsync } from 'expo-system-ui'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { enableFreeze, enableScreens } from 'react-native-screens'

import { TheStatusBar } from '@/components/TheStatusBar'

import { useTheme } from '@/hooks/useTheme'

import { persister, queryClient } from '@/api/client'
import { fontSizes } from '@/constants/uiSizes'
import { i18n } from '@/translations/i18n'

SplashScreen.preventAutoHideAsync()

SplashScreen.setOptions({
  duration: 150,
  fade: true,
})

enableFreeze(true)
enableScreens(true)

export const RootLayout = () => {
  const { schemeColor, colorScheme } = useTheme()

  const targetTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme

  const modifiedTheme: Theme = {
    ...targetTheme,
    colors: {
      ...targetTheme.colors,
      background: schemeColor.surface,
      card: schemeColor.surfaceContainer,
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
            <SafeAreaProvider>
              <Stack
                screenOptions={{
                  animation: 'fade',
                  navigationBarTranslucent: true,
                  navigationBarColor: schemeColor.surfaceContainer,
                  headerTitleAlign: 'center',
                  headerTitleStyle: {
                    fontSize: fontSizes['md'],
                  },
                  headerBackButtonDisplayMode: 'minimal',
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
                    headerShown: false,
                    navigationBarColor: schemeColor.surface,
                  }}
                />
                <Stack.Screen
                  name="group/[groupId]/edit"
                  options={{
                    headerTitle: i18n.t('editGroupTitle'),
                    navigationBarColor: schemeColor.surface,
                  }}
                />
              </Stack>
            </SafeAreaProvider>
          </BottomSheetModalProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </PersistQueryClientProvider>
  )
}

export default RootLayout
