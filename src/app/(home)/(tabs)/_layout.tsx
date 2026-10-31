import Ionicons from '@react-native-vector-icons/ionicons'
import { Tabs, type Href } from 'expo-router'
import { useEffect, useState, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Uniwind, useCSSVariable, withUniwind } from 'uniwind'

import { UButton } from '@/components/u/UButton'
import { BottomTabHeightContext } from '@/composables/useBottomTabHeight'

const screens = [
  {
    href: '/',
    icon: 'map-outline',
    iconActive: 'map',
    label: 'map',
    name: 'index',
  },
  {
    href: '/timetable',
    icon: 'time-outline',
    iconActive: 'time',
    label: 'timetable',
    name: 'timetable',
  },
  {
    href: '/settings',
    icon: 'settings-outline',
    iconActive: 'settings',
    label: 'settings',
    name: 'settings',
  },
] satisfies {
  icon: ComponentProps<typeof Ionicons>['name']
  iconActive: ComponentProps<typeof Ionicons>['name']
  label: string
  name: string
  href: Href
}[]

const StyledIonicons = withUniwind(Ionicons)

export const TabsLayout = () => {
  const { t } = useTranslation()
  const [height, setHeight] = useState(0)
  const insets = useSafeAreaInsets()

  useEffect(() => {
    Uniwind.updateInsets({
      ...insets,
      bottom: height,
    })
  }, [height])

  const color = useCSSVariable('--text-color-default')?.toString()

  return (
    <BottomTabHeightContext value={height}>
      <Tabs
        screenOptions={{ headerShown: false }}
        tabBar={({ descriptors, insets, emitter, state, navigateToTab }) => (
          <View
            className="from-default absolute bottom-0 flex-row bg-linear-to-t to-transparent dark:from-black"
            onLayout={({ nativeEvent }) => {
              setHeight(nativeEvent.layout.height)
            }}
          >
            {state.routes.map(({ key }, index) => {
              const { options } = descriptors[key]!

              let label = ''
              if (options.tabBarLabel) {
                if (typeof options.tabBarLabel === 'string') {
                  label = options.tabBarLabel
                }
              }

              const isFocused = index === state.index

              const onPress = () => {
                const event = emitter.emit({
                  canPreventDefault: true,
                  type: 'tabPress',
                })

                if (!event.defaultPrevented) {
                  navigateToTab(key)
                }
              }

              return (
                <UButton
                  key={key}
                  label={label}
                  className="flex-1 flex-col gap-0"
                  labelClassName="text-shadow-xs text-shadow-default dark:text-shadow-black/50"
                  style={{ paddingBottom: insets.bottom }}
                  variant="ghost"
                  color="neutral"
                  block
                  onPress={onPress}
                >
                  <StyledIonicons
                    name={isFocused ? screens[index]!.iconActive : screens[index]!.icon}
                    colorClassName="accent-default"
                    className="text-shadow-default font-bold text-shadow-xs dark:text-shadow-black/50"
                    size={20}
                  />
                </UButton>
              )
            })}
          </View>
        )}
      >
        {screens.map((screen) => (
          <Tabs.Screen
            key={screen.name}
            name={screen.name}
            options={{
              tabBarLabel: t(screen.label),
              tabBarLabelStyle: {
                color,
              },
            }}
          />
        ))}
      </Tabs>
    </BottomTabHeightContext>
  )
}

export default TabsLayout
