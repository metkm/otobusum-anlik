import Ionicons from '@react-native-vector-icons/ionicons'
import { Tabs } from 'expo-router'
import { ComponentProps } from 'react'

import { useTheme } from '@/hooks/useTheme'

import { i18n } from '@/translations/i18n'
import { View } from 'react-native'

const screens = [
  {
    name: 'index',
    label: 'map',
    icon: 'map',
  },
  {
    name: 'timetable',
    label: 'timetable',
    icon: 'time',
  },
  {
    name: 'settings',
    label: 'settings',
    icon: 'settings',
  },
]

export const TabsLayout = () => {
  const { colorsTheme } = useTheme()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIconStyle: {
          flex: 1,
        },
        animation: 'shift',
        freezeOnBlur: true,
      }}
      detachInactiveScreens
    >
      {screens.map(screen => (
        <Tabs.Screen
          key={screen.name}
          name={screen.name}
          options={{
            tabBarLabel: i18n.t(screen.label),
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  backgroundColor: focused ? colorsTheme.surfaceContainerHigh : undefined,
                  borderRadius: 999,
                  paddingVertical: 3,
                  paddingHorizontal: 20,
                }}
              >
                <Ionicons
                  name={
                    (focused ? `${screen.icon}` : `${screen.icon}-outline`) as ComponentProps<
                      typeof Ionicons
                    >['name']
                  }
                  size={20}
                  color={colorsTheme.color}
                  style={{ width: 20 }}
                />
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  )
}

export default TabsLayout
