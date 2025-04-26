import Ionicons from '@react-native-vector-icons/ionicons'
import { Tabs } from 'expo-router'
import { ComponentProps } from 'react'
import { View } from 'react-native'

import { useTheme } from '@/hooks/useTheme'

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
    icon: 'time',
  },
  {
    name: 'settings',
    label: 'settings',
    icon: 'settings',
  },
]

export const TabsLayout = () => {
  const { schemeDefault } = useTheme()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarIconStyle: {
          flex: 1,
        },
        tabBarLabelStyle: {
          color: schemeDefault.onSurface,
        },
        animation: 'fade',
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
                  backgroundColor: focused ? schemeDefault.surfaceContainerHigh : undefined,
                  borderRadius: 999,
                  paddingVertical: 2,
                  paddingHorizontal: 20,
                }}
              >
                <Ionicons
                  name={
                    (focused ? `${screen.icon}` : `${screen.icon}-outline`) as ComponentProps<
                      typeof Ionicons
                    >['name']
                  }
                  size={22}
                  color={schemeDefault.onSurface}
                  style={{ width: 22, height: 22 }}
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
