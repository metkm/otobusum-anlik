import Ionicons from '@react-native-vector-icons/ionicons'
import { Tabs, type Href } from 'expo-router'
import type {
  BottomTabBarProps,
  BottomTabNavigationOptions,
} from 'expo-router/build/layouts/TabsClient.js'
import { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { Touchable } from 'react-native-gesture-handler'
import Animated, {
  createAnimatedComponent,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'
import { Uniwind, useCSSVariable, useUniwind, withUniwind } from 'uniwind'

import { UIcon } from '@/components/u'
import { useMapPadding } from '@/composables'
import { useGroupItemColorCarouselOffset } from '@/composables/useGroupItemColorCarouselOffset'
import { LayoutAnimationTransition } from '@/constants/animation'

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

const PressTrigger = ({
  index,
  // options,
  isFocused,
  onPress,
}: {
  index: number
  options?: BottomTabNavigationOptions
  isFocused?: boolean
  onPress: () => void
}) => {
  const { backgroundColorSoft, borderColor } = useGroupItemColorCarouselOffset()

  const style = useAnimatedStyle(() => ({
    backgroundColor: !isFocused ? withTiming('transparent') : backgroundColorSoft.value,
    borderColor: borderColor.value,
  }))

  return (
    <AnimatedTouchable
      layout={LayoutAnimationTransition}
      underlayColor="black"
      animationDuration={0}
      androidRipple={{}}
      onPress={onPress}
      className="flex-1 flex-row items-center justify-center gap-2 overflow-hidden rounded-full p-2"
      style={style}
    >
      <StyledIonicons
        name={isFocused ? screens[index]!.iconActive : screens[index]!.icon}
        colorClassName="accent-default"
        size={20}
      />
    </AnimatedTouchable>
  )
}

export const CustomTabBar = ({
  descriptors,
  emitter,
  state,
  insets,
  navigateToTab,
}: BottomTabBarProps) => {
  const { backgroundColor, borderColor } = useGroupItemColorCarouselOffset()

  const { onLayout } = useMapPadding('navigationTabs', 'bottom')
  const { theme } = useUniwind()

  return (
    <View
      className="absolute bottom-0 flex-row justify-center gap-2"
      onLayout={(event) => {
        Uniwind.updateCSSVariables(theme, {
          '--navigation-height': event.nativeEvent.layout.height,
        })
        onLayout(event)
      }}
    >
      <Animated.View
        layout={LayoutAnimationTransition}
        className="flex-row grow p-1.5 rounded-t-md"
        style={{ backgroundColor, borderColor, paddingBottom: insets.bottom }}
      >
        {state.routes.map(({ key }, index) => (
          <PressTrigger
            key={key}
            index={index}
            options={descriptors[key]?.options}
            isFocused={state.index === index}
            onPress={() => {
              const event = emitter.emit({
                canPreventDefault: true,
                type: 'tabPress',
              })

              if (!event.defaultPrevented) {
                navigateToTab(key)
              }
            }}
          />
        ))}
      </Animated.View>
    </View>
  )
}

export const TabsLayout = () => {
  const { t } = useTranslation()
  const color = useCSSVariable('--text-color-default')?.toString()

  return (
    <Tabs
      screenOptions={{ animation: 'shift', headerShown: false }}
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
