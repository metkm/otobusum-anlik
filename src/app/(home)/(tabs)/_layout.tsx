import Ionicons from '@react-native-vector-icons/ionicons'
import { Tabs, type Href } from 'expo-router'
import { useEffect, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Uniwind, useCSSVariable, withUniwind } from 'uniwind'

import { UButton } from '@/components/u/UButton'
import { useBottomTabHeight } from '@/composables/useBottomTabHeight'

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
  const bottomTabHeight = useBottomTabHeight()
  const insets = useSafeAreaInsets()

  useEffect(() => {
    Uniwind.updateInsets({
      ...insets,
      bottom: bottomTabHeight?.height ?? 0,
    })
  }, [bottomTabHeight?.height])

  const color = useCSSVariable('--text-color-default')?.toString()

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={({ descriptors, insets, emitter, state, navigateToTab }) => {
        console.log('tabbar')

        return (
          <View
            className="absolute bottom-0 flex-row bg-linear-to-t from-black to-transparent"
            onLayout={({ nativeEvent }) => {
              if (bottomTabHeight) {
                bottomTabHeight.setHeight(nativeEvent.layout.height)
              }
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
                  style={{ paddingBottom: insets.bottom }}
                  variant="ghost"
                  color="neutral"
                  block
                  onPress={onPress}
                >
                  <StyledIonicons
                    name={isFocused ? screens[index]!.iconActive : screens[index]!.icon}
                    colorClassName="accent-default"
                    size={18}
                  />
                </UButton>
              )
            })}
          </View>
        )
      }}
    >
      {screens.map((screen) => (
        <Tabs.Screen
          key={screen.name}
          name={screen.name}
          options={{
            // tabBarIcon: ({ focused }) => (
            //   <View
            //     className={cn(
            //       focused ? 'bg-muted border-hairline border-accented' : undefined,
            //       'w-12 h-6 rounded-md items-center justify-center',
            //     )}
            //   >
            //     <Ionicons
            //       name={
            //         (focused ? screen.iconActive : screen.icon) as ComponentProps<
            //           typeof Ionicons
            //         >['name']
            //       }
            //       color={color}
            //       size={20}
            //     />
            //   </View>
            // ),
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
