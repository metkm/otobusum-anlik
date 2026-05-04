import '../global.css'

import { createTrueSheetNavigator, TrueSheetNavigationEventMap, TrueSheetNavigationOptions, TrueSheetNavigationState } from '@lodev09/react-native-true-sheet/navigation'
import { ReanimatedTrueSheetProvider } from '@lodev09/react-native-true-sheet/reanimated'
import { DarkTheme, DefaultTheme, ThemeProvider, type Theme, type ParamListBase } from '@react-navigation/native'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { withLayoutContext } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { I18nextProvider, useTranslation } from 'react-i18next'
import { useColorScheme } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { SafeAreaListener, useSafeAreaInsets } from 'react-native-safe-area-context'
import { Uniwind, useCSSVariable } from 'uniwind'
import { useShallow } from 'zustand/react/shallow'

import { AppOnboarding } from '@/components/AppOnboarding'
import { MapProvider } from '@/components/MapProvider'
import { UButton } from '@/components/u/UButton'

import { persister, queryClient } from '@/api/client'
import { useLineStore, useSettingsStore } from '@/stores'
import i18n from '@/translations/i18n'

const { Navigator } = createTrueSheetNavigator()

export const Sheet = withLayoutContext<
  TrueSheetNavigationOptions,
  typeof Navigator,
  TrueSheetNavigationState<ParamListBase>,
  TrueSheetNavigationEventMap
>(Navigator)

const RootContent = () => {
  const showOnBoarding = useSettingsStore(useShallow(state => state.showOnBoarding))
  const { t } = useTranslation()

  const background = useCSSVariable('--background-color-default')
  const insets = useSafeAreaInsets()

  const colorScheme = useColorScheme()
  const baseTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme

  const storeColor = useSettingsStore.getState().colorScheme
  if (storeColor) {
    Uniwind.setTheme(storeColor)
  }

  if (showOnBoarding) {
    return <AppOnboarding />
  }

  return (
    <KeyboardProvider>
      <MapProvider>
        <Sheet
          screenOptions={{
            grabberOptions: {
              topMargin: 8,
              height: 4,
            },
            backgroundColor: background as string ?? baseTheme.colors.background,
            footerStyle: {
              paddingBottom: insets.bottom + 8,
              paddingHorizontal: 8,
            },
          }}
        >
          <Sheet.Screen name="(home)" />
          <Sheet.Screen
            name="(sheet)/groups"
            options={{
              detents: [0.5, 1],
              footer: (
                <GestureHandlerRootView style={{ alignItems: 'flex-end' }}>
                  <UButton
                    label={t('newGroup')}
                    icon="plus-circle"
                    size="lg"
                    onPress={() => {
                      useLineStore.getState().createGroup()
                    }}
                    className="w-max"
                  />
                </GestureHandlerRootView>
              ),
              scrollable: true,
            }}
          />
        </Sheet>
      </MapProvider>
    </KeyboardProvider>
  )
}

export const RootLayout = () => {
  const background = useCSSVariable('--background-color-default')

  const colorScheme = useColorScheme()
  const baseTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme

  const theme: Theme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      background: background as string ?? baseTheme.colors.background,
      card: background as string ?? baseTheme.colors.background,
    },
  }

  return (
    <I18nextProvider i18n={i18n} defaultNS="translation">
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister,
          dehydrateOptions: {
            shouldDehydrateQuery: (query) => {
              return !!query.meta?.persist
            },
          },
        }}
      >
        <StatusBar style="auto" />

        <GestureHandlerRootView
          style={{ flexGrow: 1, backgroundColor: background as string }}
        >
          <SafeAreaListener
            onChange={({ insets }) => {
              Uniwind.updateInsets(insets)
            }}
          >
            <ThemeProvider value={theme}>
              <ReanimatedTrueSheetProvider>
                <RootContent />
              </ReanimatedTrueSheetProvider>
            </ThemeProvider>
          </SafeAreaListener>
        </GestureHandlerRootView>
      </PersistQueryClientProvider>
    </I18nextProvider>
  )
}

export default RootLayout
