import Ionicons from '@react-native-vector-icons/ionicons'
import { Tabs, type Href } from 'expo-router'
import { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useCSSVariable, withUniwind } from 'uniwind'

import { UButton } from '@/components/u/UButton'
import { useMapPadding } from '@/composables/useMapPadding'

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
  const { onLayout } = useMapPadding('bottom')

  const color = useCSSVariable('--text-color-default')?.toString()

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={({ descriptors, emitter, state, navigateToTab }) => (
        <View
          className="absolute bottom-0 flex-row bg-linear-to-t from-white/90 via-white/45 to-transparent dark:from-black/90 dark:via-black/85"
          onLayout={onLayout}
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
                className="pb-safe-offset-2 flex-1 flex-col gap-0"
                labelClassName="text-shadow-white dark:text-shadow-black text-shadow-lg"
                variant="ghost"
                color="neutral"
                block
                onPress={onPress}
              >
                <StyledIonicons
                  name={isFocused ? screens[index]!.iconActive : screens[index]!.icon}
                  colorClassName="accent-default"
                  className="text-shadow-lg text-shadow-white dark:text-shadow-black"
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
  )
}

export default TabsLayout
