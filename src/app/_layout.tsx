import '../global.css'

import { createTrueSheetNavigator, TrueSheetNavigationEventMap, TrueSheetNavigationOptions, TrueSheetNavigationState } from '@lodev09/react-native-true-sheet/navigation'
import { ReanimatedTrueSheetProvider, useReanimatedTrueSheet } from '@lodev09/react-native-true-sheet/reanimated'
import { DarkTheme, DefaultTheme, ThemeProvider, type Theme, type ParamListBase } from '@react-navigation/native'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { withLayoutContext } from 'expo-router'
import React from 'react'
import { Dimensions, useColorScheme } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { interpolate, useAnimatedReaction, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { SafeAreaListener, useSafeAreaInsets } from 'react-native-safe-area-context'
import { Uniwind, useCSSVariable } from 'uniwind'

import { persister, queryClient } from '@/api/client'

const { Navigator } = createTrueSheetNavigator()

export const Sheet = withLayoutContext<
  TrueSheetNavigationOptions,
  typeof Navigator,
  TrueSheetNavigationState<ParamListBase>,
  TrueSheetNavigationEventMap
>(Navigator)

const width = Dimensions.get('window').width

const RootContent = () => {
  const background = useCSSVariable('--background-color-default')

  const colorScheme = useColorScheme()
  const baseTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme

  const index = useSharedValue(0)
  const insets = useSafeAreaInsets()
  const { animatedIndex } = useReanimatedTrueSheet()

  const style = useAnimatedStyle(() => ({
    flex: 1,
    transform: [
      {
        scale: interpolate(index.value, [-1, 0], [1, (width - insets.top) / width], 'clamp'),
      },
    ],
    borderRadius: interpolate(index.value, [-1, 0], [0, 8], 'clamp'),
    overflow: 'hidden',
  }))

  useAnimatedReaction(() => animatedIndex.value, () => {
    index.value = animatedIndex.value
  })

  return (
    <Animated.View style={style}>
      <Sheet
        screenOptions={{
          grabberOptions: {
            topMargin: 8,
            height: 4,
          },
          backgroundColor: background as string ?? baseTheme.colors.background,
          reanimated: true,
          positionChangeHandler: (payload) => {
            'worklet'
            index.value = payload.index
          },
        }}
      >
        <Sheet.Screen name="(home)" />
        <Sheet.Screen name="stop" />
        <Sheet.Screen
          name="groups"
          options={{ scrollable: true, detents: [0.5, 1] }}
        />
      </Sheet>
    </Animated.View>
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
  )

  // const { schemeColor, colorScheme } = useTheme()

  // const targetTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme

  // const modifiedTheme: Theme = {
  //   ...targetTheme,
  //   colors: {
  //     ...targetTheme.colors,
  //     background: schemeColor.surface,
  //     card: schemeColor.surfaceContainer,
  //   },
  // }

  // setBackgroundColorAsync(modifiedTheme.colors.background)

  // const dehydrateOptions: DehydrateOptions = {
  //   shouldDehydrateQuery: (query) => {
  //     return !!query.meta?.persist
  //   },
  // }

  // return (
  //   <PersistQueryClientProvider
  //     client={queryClient}
  //     persistOptions={{
  //       persister,
  //       dehydrateOptions,
  //     }}
  //   >
  //     <TheStatusBar />

  //     <GestureHandlerRootView>
  //       <ThemeProvider value={modifiedTheme}>
  //         <BottomSheetModalProvider>
  //           <SafeAreaProvider>
  //             <Stack
  //               screenOptions={{
  //                 headerTitleAlign: 'center',
  //                 headerTitleStyle: {
  //                   fontSize: fontSizes['md'],
  //                 },
  //                 headerBackButtonDisplayMode: 'minimal',
  //               }}
  //             >
  //               <Stack.Screen
  //                 name="(tabs)"
  //                 options={{
  //                   headerShown: false,
  //                 }}
  //               />
  //               <Stack.Screen
  //                 name="modal"
  //                 options={{
  //                   presentation: 'modal',
  //                   headerShown: false,
  //                 }}
  //               />
  //               <Stack.Screen
  //                 name="group/[groupId]/edit"
  //                 options={{
  //                   headerTitle: i18n.t('editGroupTitle'),
  //                 }}
  //               />
  //             </Stack>
  //           </SafeAreaProvider>
  //         </BottomSheetModalProvider>
  //       </ThemeProvider>
  //     </GestureHandlerRootView>
  //   </PersistQueryClientProvider>
  // )
}

export default RootLayout
