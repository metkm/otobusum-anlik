import { DarkTheme, DefaultTheme } from '@react-navigation/native'
import { useColorScheme } from 'react-native'
import Animated from 'react-native-reanimated'
import { useCSSVariable } from 'uniwind'

import { Sheet } from '@/app/_layout'

const AnimatedSheet = Animated.createAnimatedComponent(Sheet)

export const GroupsLayout = () => {
  const background = useCSSVariable('--background-color-default')

  const colorScheme = useColorScheme()
  const baseTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme

  return (
    <AnimatedSheet
      screenOptions={{
        grabberOptions: {
          topMargin: 8,
          height: 4,
        },
        backgroundColor: background as string ?? baseTheme.colors.background,
        footerStyle: {
          paddingHorizontal: 8,
        },
      }}
    >
      <Sheet.Screen name="index" />
      <Sheet.Screen name="[groupId]" />
    </AnimatedSheet>
  )
}

export default GroupsLayout
