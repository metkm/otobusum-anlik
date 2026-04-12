import Ionicons from '@react-native-vector-icons/ionicons'
import { Tabs } from 'expo-router'
import { ComponentProps } from 'react'
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
    icon: 'time',
  },
  {
    name: 'settings',
    label: 'settings',
    icon: 'settings',
  },
]

export const TabsLayout = () => {
  const color = useCSSVariable('--text-default')

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
              type IconName = ComponentProps<typeof Ionicons>['name']
              const icon = focused ? screen.icon : `${screen.icon}-outline`

              return (
                <Ionicons
                  name={icon as IconName}
                  size={20}
                  color={color as string}
                  className="size-5"
                />
              )
            },
          }}
        />
      ))}
    </Tabs>

  // <Tabs
  //   screenOptions={{
  //     headerShown: false,
  //     tabBarIconStyle: {
  //       flex: 1,
  //     },
  //     tabBarShowLabel: Platform.OS !== 'web',
  //     tabBarLabelStyle: {
  //       color: schemeDefault.onSurface,
  //     },
  //     freezeOnBlur: true,
  //     animation: 'shift',
  //   }}
  //   detachInactiveScreens
  // >
  //   {screens.map(screen => (
  //     <Tabs.Screen
  //       key={screen.name}
  //       name={screen.name}
  //       options={{
  //         tabBarLabel: i18n.t(screen.label),
  //         tabBarIcon: ({ focused }) => (
  //           <View
  //             style={{
  //               backgroundColor: focused ? schemeDefault.surfaceContainerHigh : undefined,
  //               borderRadius: 999,
  //               paddingVertical: 2,
  //               paddingHorizontal: 20,
  //             }}
  //           >
  //             <Ionicons
  //               name={
  //                 (focused ? `${screen.icon}` : `${screen.icon}-outline`) as ComponentProps<
  //                   typeof Ionicons
  //                 >['name']
  //               }
  //               size={22}
  //               color={schemeDefault.onSurface}
  //               style={{ width: 22, height: 22 }}
  //             />
  //           </View>
  //         ),
  //       }}
  //     />
  //   ))}
  // </Tabs>
  )
}

export default TabsLayout
