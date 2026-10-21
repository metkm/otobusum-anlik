import IonIcons from '@react-native-vector-icons/ionicons'
import { Tabs } from 'expo-router'
import type { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { cn } from 'tailwind-variants'
import { useCSSVariable } from 'uniwind'

const screens = [
  {
    icon: 'map-outline',
    iconActive: 'map',
    label: 'map',
    name: 'index',
  },
  {
    icon: 'time-outline',
    iconActive: 'time',
    label: 'timetable',
    name: 'timetable',
  },
  {
    icon: 'settings-outline',
    iconActive: 'settings',
    label: 'settings',
    name: 'settings',
  },
]

export const TabsLayout = () => {
  const color = useCSSVariable('--text-color-default')
  const { t } = useTranslation()

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {screens.map((screen) => (
        <Tabs.Screen
          key={screen.name}
          name={screen.name}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                className={cn(
                  focused ? 'bg-muted' : undefined,
                  'w-12 h-6 rounded-md items-center justify-center',
                )}
              >
                <IonIcons
                  name={
                    (focused ? screen.iconActive : screen.icon) as ComponentProps<
                      typeof IonIcons
                    >['name']
                  }
                  color={color as string}
                  size={20}
                />
              </View>
            ),
            tabBarLabel: t(screen.label),
            tabBarLabelStyle: {
              color: color as string,
            },
          }}
        />
      ))}
    </Tabs>
  )
}

export default TabsLayout
