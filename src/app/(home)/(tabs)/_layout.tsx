import { useTrueSheetNavigation } from '@lodev09/react-native-true-sheet/navigation/expo-router'
import Ionicons from '@react-native-vector-icons/ionicons'
import { Tabs, type Href } from 'expo-router'
import type { BottomTabBarProps } from 'expo-router/build/layouts/TabsClient.js'
import { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { Touchable } from 'react-native-gesture-handler'
import Animated, { createAnimatedComponent } from 'react-native-reanimated'
import { Uniwind, useCSSVariable, useUniwind, withUniwind } from 'uniwind'

import { UIcon, UText } from '@/components/u'
import { useMapPadding } from '@/composables'
import { LayoutAnimationTransition } from '@/constants/animation'
import { cn } from '@/utils/cn'

type IconName = ComponentProps<typeof Ionicons>['name']

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
    href: '/search',
    icon: 'search',
    iconActive: 'search',
    label: 'search',
    name: 'search',
  },
  {
    href: '/settings',
    icon: 'settings-outline',
    iconActive: 'settings',
    label: 'settings',
    name: 'settings',
  },
] satisfies {
  icon: IconName
  iconActive: IconName
  label: string
  name: string
  href: Href
}[]

const StyledIonicons = withUniwind(Ionicons)
const StyledTouchable = withUniwind(Touchable)
const AnimatedTouchable = createAnimatedComponent(StyledTouchable)

export const CustomTabBar = ({ descriptors, emitter, state, navigateToTab }: BottomTabBarProps) => {
  const navigation = useTrueSheetNavigation()

  // const { group } = useLineGroup()
  const { onLayout } = useMapPadding('navigationTabs', 'bottom')
  const { theme } = useUniwind()

  return (
    <View className="bottom-safe-offset-2 absolute inset-x-2 flex-row items-center justify-between gap-2">
      <Animated.View
        layout={LayoutAnimationTransition}
        className="bg-default border-hairline border-accented flex-row gap-2 rounded-full p-1"
        onLayout={(event) => {
          Uniwind.updateCSSVariables(theme, {
            '--navigation-height': event.nativeEvent.layout.height,
          })
          onLayout(event)
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
            <AnimatedTouchable
              key={key}
              layout={LayoutAnimationTransition}
              underlayColor="black"
              animationDuration={0}
              androidRipple={{}}
              onPress={onPress}
              className={cn(
                'flex-row items-center gap-2 p-3 rounded-full overflow-hidden',
                isFocused && 'bg-accented',
              )}
            >
              <StyledIonicons
                name={isFocused ? screens[index]!.iconActive : screens[index]!.icon}
                colorClassName="accent-default"
                size={20}
              />

              {isFocused && <UText className="font-inter-medium text-sm">{label}</UText>}
            </AnimatedTouchable>
          )
        })}
      </Animated.View>

      <Animated.View
        layout={LayoutAnimationTransition}
        className="bg-default border-hairline border-accented shrink overflow-hidden rounded-full p-1"
      >
        <AnimatedTouchable
          underlayColor="black"
          animationDuration={0}
          androidRipple={{}}
          onPress={() => {
            navigation.navigate('(sheet)/groups/index')
          }}
          className="shrink flex-row items-center gap-2 overflow-hidden rounded-full p-3"
        >
          <UIcon
            name="component"
            sizeClassName="size-5"
            colorClassName="accent-default"
          />

          {/* <UText
            className="font-inter-medium shrink truncate text-sm overflow-hidden"
            numberOfLines={1}
          >
            {group?.name}
          </UText> */}
        </AnimatedTouchable>
      </Animated.View>
    </View>
  )
}

export const TabsLayout = () => {
  const { t } = useTranslation()
  const color = useCSSVariable('--text-color-default')?.toString()

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
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
