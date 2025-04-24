import '@/assets/styles.css'

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { getHeaderTitle } from '@react-navigation/elements'
import { DarkTheme, DefaultTheme, ThemeProvider, type Theme } from '@react-navigation/native'
import { type NativeStackHeaderProps } from '@react-navigation/native-stack'
import { DehydrateOptions } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { setBackgroundColorAsync } from 'expo-system-ui'
import { View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import { enableFreeze, enableScreens } from 'react-native-screens'

import { TheStatusBar } from '@/components/TheStatusBar'
import { UiButton } from '@/components/ui/UiButton'
import { UiText } from '@/components/ui/UiText'

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

const MyHeader = ({ navigation, route, options, back }: NativeStackHeaderProps) => {
  const insets = useSafeAreaInsets()
  const { colorsTheme } = useTheme()
  const title = getHeaderTitle(options, route.name)

  return (
    <View
      style={{
        paddingTop: 8 + insets.top,
        padding: 8,
        backgroundColor: colorsTheme.surfaceContainerLow,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <View>
        {back
          ? (
              <UiButton onPress={navigation.goBack} icon="arrow-back" variant="soft" />
            )
          : undefined}
      </View>

      <UiText>{title}</UiText>

      {/* @ts-ignore */}
      {options.headerRight?.()}
    </View>
  )
}

export const RootLayout = () => {
  const { colorsTheme, mode } = useTheme()

  const targetTheme = mode === 'dark' ? DarkTheme : DefaultTheme

  const modifiedTheme: Theme = {
    ...targetTheme,
    colors: {
      ...targetTheme.colors,
      background: colorsTheme.surfaceContainerLowest,
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
            <SafeAreaProvider>
              <Stack
                screenOptions={{
                  animation: 'fade',
                  header: MyHeader,
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
                  }}
                />
                <Stack.Screen
                  name="group/[groupId]/edit"
                  options={{ headerTitle: i18n.t('editGroupTitle') }}
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
