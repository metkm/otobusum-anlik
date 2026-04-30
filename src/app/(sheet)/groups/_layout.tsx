import { DarkTheme, DefaultTheme } from '@react-navigation/native'
import { useColorScheme } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useCSSVariable } from 'uniwind'

import { Sheet } from '@/app/_layout'

export const GroupsLayout = () => {
  const background = useCSSVariable('--background-color-default')
  const insets = useSafeAreaInsets()

  const colorScheme = useColorScheme()
  const baseTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme

  return (
    <Sheet
      screenOptions={{
        grabberOptions: {
          topMargin: 8,
          height: 4,
        },
        backgroundColor: background as string ?? baseTheme.colors.background,
        footerStyle: {
          paddingBottom: insets.bottom,
          paddingHorizontal: 8,
        },
      }}
    >
      <Sheet.Screen name="index" />
      <Sheet.Screen name="[groupId]" />
    </Sheet>
  )
}

export default GroupsLayout
