// import Ionicons from '@react-native-vector-icons/ionicons'
import Lucide from '@react-native-vector-icons/lucide'
import { Tabs } from 'expo-router'
import { ComponentProps } from 'react'
import { View } from 'react-native'
import { cn } from 'tailwind-variants'
import { useCSSVariable } from 'uniwind'

import { i18n } from '@/translations/i18n'

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

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {screens.map(screen => (
        <Tabs.Screen
          key={screen.name}
          name={screen.name}
          options={{
            tabBarLabel: i18n.t(screen.label),
            tabBarLabelStyle: {
              color: color as string,
            },
            tabBarIcon: ({ focused }) => {
              type IconName = ComponentProps<typeof Lucide>['name']
              // const icon = focused ? screen.icon : `${screen.icon}-filled`

              return (
                <View className={cn(
                  'px-3 py-0.5 rounded-md',
                  focused ? 'bg-muted' : undefined,
                )}
                >
                  <Lucide
                    name={screen.icon as IconName}
                    size={20}
                    color={color as string}
                    className="size-5"
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
