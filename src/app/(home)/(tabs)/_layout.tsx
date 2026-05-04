import { Tabs } from 'expo-router'
import { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { cn } from 'tailwind-variants'
import { useCSSVariable } from 'uniwind'

import { UIcon } from '@/components/u/UIcon'

const screens = [
  {
    name: 'index',
    label: 'map',
    icon: 'map',
  },
  {
    name: 'timetable',
    label: 'timetable',
    icon: 'clock',
  },
  {
    name: 'settings',
    label: 'settings',
    icon: 'settings',
  },
]

export const TabsLayout = () => {
  const color = useCSSVariable('--text-color-default')
  const { t } = useTranslation()

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {screens.map(screen => (
        <Tabs.Screen
          key={screen.name}
          name={screen.name}
          options={{
            tabBarLabel: t(screen.label),
            tabBarLabelStyle: {
              color: color as string,
            },
            tabBarIcon: ({ focused }) => {
              type IconName = ComponentProps<typeof UIcon>['name']

              return (
                <View className={cn(
                  'px-3 py-0.5 rounded-md',
                  focused ? 'bg-muted' : undefined,
                )}
                >
                  <UIcon
                    name={screen.icon as IconName}
                    color={color as string}
                    sizeClassName="w-5"
                    size={20}
                  />
                </View>
              )
            },
          }}
        />
      ))}
    </Tabs>
  )
}

export default TabsLayout
